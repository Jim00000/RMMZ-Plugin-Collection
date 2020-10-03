//=============================================================================
// RPG Maker MZ - Light Map
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add light map effect (WIP)
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_LightMap.js
 * @base JPC_Core
 * @help
 *
 * This script adds a pointlight source to the player sprite. You can add
 * following tags in the map's note to set up the parameters :
 *
 * <jpc>
 *   <lightmap>
 *     <global_illumination>0.0</global_illumination>
 *     <light_radius>64.0</light_radius>
 *     <enable>true</enable>
 *     <player>
 *       <is_light_source>true</is_light_source>
 *       <light_radius>32.0</light_radius>
 *       <spotlight_radius>400.0</spotlight_radius>
 *       <perspective>15.0</perspective>
 *       <lighttype>
 *         <is_point_light>true</is_point_light>
 *         <is_spotlight>true</is_spotlight>
 *       </lighttype>
 *     </player>
 *   </lightmap>
 * </jpc>
 *
 * To make a object become glowable, in the event editor, fill following data
 * into the note textbox :
 *
 * <jpc>
 *   <lightmap>
 *     <lightobj>true</lightobj>
 *     <r>1.0</r>
 *     <g>0.0</g>
 *     <b>0.0</b>
 *     <radius>100.0</radius>
 *     <light_direction>down</light_direction>
 *     <perspective>45.0</perspective>
 *     <spotlight_radius>200.0</spotlight_radius>
 *     <lighttype>
 *       <is_point_light>false</is_point_light>
 *       <is_spotlight>true</is_spotlight>
 *     </lighttype>
 *   </lightmap>
 * </jpc>
 *
 * You had better remove all of newline character ('\n', input "Enter" button
 * to end cuurent line) because only a few lines in the note textbox remains
 * (the other parts will be cut off) in the event editor in RMMZ editor.
 *
 * e.g. <jpc><lightmap><lightobj>true...</jpc> and put it in the
 * textbox of note.
 *
 * Note that there are at most 32 light objects allowed in a map due to in
 * consideration for the performance.
 *
 * @param default_light_radius
 * @text Default radius of the light.
 * @type number
 * @default 256.0
 * @min 0.0
 *
 * @param default_global_illumination
 * @text Default global illumination for the environment/map.
 * @type number
 * @default 1.0
 * @min 0.0
 * @max 1.0
 *
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JPC_LightMap';
    const LIGHTMAP_SHADER_PATH = 'js/plugins/shaders/lightmap.fs';
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    const ILLUMINATION = parseFloat(PLUGINPARAMS['default_global_illumination']);
    const LIGHT_RADIUS = parseFloat(PLUGINPARAMS['default_light_radius']);
    const MAX_LIGHTS =
        32;  // This value must be consistent with the macro value defined in the the lightmap.fs shader file.

    JPC.lightmap = (() => {
        'use strict';
        var Exported = {};
        // Tell whether the light map effect is enabled
        Exported.enable;
        // Global illumination
        Exported.globalIllumination;
        Exported.Player = (() => {
            'use strict';
            var Exported = {};
            // Is player a light source
            Exported.isLightSrc;
            // Player's light radius
            Exported.lightRadius;
            // Player's perspective in degree
            Exported.perspective;
            // Player's spotlight radius
            Exported.spotlightRadius;
            return Exported;
        })();
        return Exported;
    })();

    function lightDirectionStringToIndex(string) {
        if (string === 'down') {
            return 2;
        } else if (string === 'left') {
            return 4;
        } else if (string === 'right') {
            return 6;
        } else if (string === 'up') {
            return 8;
        } else {
            return 0;
        }
    }

    function createLightMap(_illumination) {
        const fragShaderCode = JPC.loadGLSLShaderFile(LIGHTMAP_SHADER_PATH);
        const filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, fragShaderCode, {
            globalIllumination: _illumination,
            lightRadius: new Float32Array(MAX_LIGHTS),
            lightSrcSize: 0,
            lightsrc: new Float32Array(MAX_LIGHTS * 2),
            uTime: new Float32Array(MAX_LIGHTS),
            ambientColor: new Float32Array(MAX_LIGHTS * 3),
            lightDirIdx: 0,  // unknown light direction
            perspective: new Float32Array(MAX_LIGHTS).fill(1.0),
            fSpotlightRadius: new Float32Array(MAX_LIGHTS).fill(1.0),
            lightType: new Int32Array(MAX_LIGHTS),
            lightDirIdx: new Int32Array(MAX_LIGHTS)
        });
        return filter;
    };

    function updateLightMap(spritest_map) {
        // Find Player's sprite
        if (spritest_map.playerSprite == null) {
            spritest_map.playerSprite = SceneManager._scene._spriteset._characterSprites.find(
                character => character._character instanceof Game_Player);
        }

        // Find game events which represents light source
        if (spritest_map.isLightSrcFound == false) {
            SceneManager._scene._spriteset._characterSprites.forEach(character => {
                if (character._character !== undefined && character._character instanceof Game_Event &&
                    character.isEmptyCharacter() === false) {
                    const eventId = character._character._eventId;
                    const note = $dataMap.events[eventId].note
                    // Skip event whose note is empty and verify that this is a light object
                    if ($dataMap.events[eventId].note.length > 0 &&
                        JPC.parseNoteToBoolean(note, 'lightmap.lightobj') === true) {
                        // Append to the light object list
                        spritest_map.lightObjPos.push(character.position);
                        // Append to ambient color list
                        var r = JPC.parseNoteToFloat(note, 'lightmap.r');
                        var g = JPC.parseNoteToFloat(note, 'lightmap.g');
                        var b = JPC.parseNoteToFloat(note, 'lightmap.b');
                        spritest_map.ambientColor.push(
                            {r: r != null ? r : 1.0, g: g != null ? g : 1.0, b: b != null ? b : 1.0});
                        // Append radius for each object
                        var _radius = JPC.parseNoteToFloat(note, 'lightmap.radius');
                        spritest_map.lightRadius.push(_radius !== null ? _radius : spritest_map.defaultLightRadius);
                        // Append lighttype
                        let _isPointLight = JPC.parseNoteToBoolean(note, 'lightmap.lighttype.is_point_light');
                        let isPointLight = _isPointLight !== null ? _isPointLight : false;
                        let _isSpotLight = JPC.parseNoteToBoolean(note, 'lightmap.lighttype.is_spotlight');
                        let isSpotLight = _isSpotLight !== null ? _isSpotLight : false;
                        let encodedLightType = 0b00;
                        encodedLightType |= isPointLight === true ? 0b01 : 0b00;
                        encodedLightType |= isSpotLight === true ? 0b10 : 0b00;
                        spritest_map.lightTypes.push(encodedLightType);
                        // Append light direction index
                        let _lightDirString = JPC.parseNote(note, 'lightmap.light_direction');
                        let lightDirString = _lightDirString !== null ? _lightDirString : 'down';
                        let lightDirIdx = lightDirectionStringToIndex(lightDirString);
                        spritest_map.lightDirIdx.push(lightDirIdx);
                        // Append perspective for spotlight
                        let _perspective = JPC.parseNoteToFloat(note, 'lightmap.perspective');
                        let perspective = _perspective !== null ? _perspective : 15.0;
                        spritest_map.perspective.push(perspective);
                        // Append spotlight radius for spotlight
                        let _spotlightRadius = JPC.parseNoteToFloat(note, 'lightmap.spotlight_radius');
                        let spotlightRadius = _spotlightRadius !== null ? _spotlightRadius : 300.0;
                        spritest_map.spotlightRadius.push(spotlightRadius);
                        // Append utime
                        let _utime = Math.random();
                        spritest_map.utime.push(_utime);
                        _utime = 0.4 + 0.6 * (Math.random() - 0.5);
                        spritest_map.utime_steps.push(_utime);
                    }
                }
            });

            // Check whether the size is consistent
            if (spritest_map.lightObjPos.length !== spritest_map.ambientColor.length) {
                Graphics.printError(
                    PLUGIN_NAME + '.js : ' + new Error().lineNumber,
                    'size of lightObjPos is not equal to ambientColor');
            }

            // Check whether the size is consistent
            if (spritest_map.ambientColor.length !== spritest_map.lightRadius.length) {
                Graphics.printError(
                    PLUGIN_NAME + '.js : ' + new Error().lineNumber,
                    'size of ambientColor is not equal to lightRadius');
            }

            // Update light source' count
            // One more count is for player
            spritest_map.lightmap.uniforms.lightSrcSize = spritest_map.lightObjPos.length + 1;

            spritest_map.isLightSrcFound = true;
        }

        if (JPC.lightmap.Player.isLightSrc == true) {
            // Update player's position
            spritest_map.lightmap.uniforms.lightsrc[0] = spritest_map.playerSprite.position._x;
            spritest_map.lightmap.uniforms.lightsrc[1] = spritest_map.playerSprite.position._y;
            // Update player's ambient color
            spritest_map.lightmap.uniforms.ambientColor[0] = 1.0;
            spritest_map.lightmap.uniforms.ambientColor[1] = 1.0;
            spritest_map.lightmap.uniforms.ambientColor[2] = 1.0;
            // Update player's light radius
            spritest_map.lightmap.uniforms.lightRadius[0] = JPC.lightmap.Player.lightRadius;
            // Update player's perspective direction
            spritest_map.lightmap.uniforms.lightDirIdx[0] = $gamePlayer.direction();
            // Update player's perspective angle in degree
            spritest_map.lightmap.uniforms.perspective[0] = JPC.lightmap.Player.perspective;
            // Update player's spotlight radius
            spritest_map.lightmap.uniforms.fSpotlightRadius[0] = JPC.lightmap.Player.spotLightRadius;
            // Update player's uTime
            spritest_map.lightmap.uniforms.uTime[0] += spritest_map.utime_steps[0];
        } else {
            // Move light source of player out of the screen
            spritest_map.lightmap.uniforms.lightsrc[0] = -99999;
            spritest_map.lightmap.uniforms.lightsrc[1] = -99999;
        }

        // Loop to update every light object
        for (let i = 0; i < spritest_map.lightObjPos.length; i++) {
            // Update light source's position
            var dx = (spritest_map.lightObjPos[i]._x - spritest_map.playerSprite.position._x) * $gameScreen._zoomScale;
            var dy = (spritest_map.lightObjPos[i]._y - spritest_map.playerSprite.position._y) * $gameScreen._zoomScale;
            spritest_map.lightmap.uniforms.lightsrc[2 + 2 * i + 0] = dx + spritest_map.playerSprite.position._x;
            spritest_map.lightmap.uniforms.lightsrc[2 + 2 * i + 1] = dy + spritest_map.playerSprite.position._y;
            // Update ambient color
            spritest_map.lightmap.uniforms.ambientColor[3 + 3 * i + 0] = spritest_map.ambientColor[i].r;
            spritest_map.lightmap.uniforms.ambientColor[3 + 3 * i + 1] = spritest_map.ambientColor[i].g;
            spritest_map.lightmap.uniforms.ambientColor[3 + 3 * i + 2] = spritest_map.ambientColor[i].b;
            // Update light radius
            spritest_map.lightmap.uniforms.lightRadius[1 + i] = spritest_map.lightRadius[i];
            // Update light type
            spritest_map.lightmap.uniforms.lightType[1 + i] = spritest_map.lightTypes[i];
            // Update light direction index
            spritest_map.lightmap.uniforms.lightDirIdx[1 + i] = spritest_map.lightDirIdx[i];
            // Update perspective for spotlight
            spritest_map.lightmap.uniforms.perspective[1 + i] = spritest_map.perspective[i];
            // Update spotlightRadius for spotlight
            spritest_map.lightmap.uniforms.fSpotlightRadius[1 + i] = spritest_map.spotlightRadius[i];
            // Update uTime
            spritest_map.lightmap.uniforms.uTime[1 + i] += spritest_map.utime_steps[i];
        }

        // Update global illumination
        spritest_map.lightmap.uniforms.globalIllumination = JPC.lightmap.globalIllumination;
    };

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        const radius = JPC.parseNoteToFloat($dataMap.note, 'lightmap.light_radius');
        this.defaultLightRadius = radius !== null ? radius : LIGHT_RADIUS;
        const illumination = JPC.parseNoteToFloat($dataMap.note, 'lightmap.global_illumination');
        JPC.lightmap.globalIllumination = illumination !== null ? illumination : ILLUMINATION;
        this.lightmap = createLightMap(JPC.lightmap.globalIllumination);
        this.filters.push(this.lightmap);
        this.lightmapUpdateHandler = updateLightMap;
        this.playerSprite = null;
        this.isLightSrcFound = false;  // do not modify this
        this.lightObjPos = [];         // light object's position
        this.ambientColor = [];
        this.lightRadius = [];
        this.lightTypes = [];
        this.lightDirIdx = [];
        this.perspective = [];
        this.spotlightRadius = [];
        this.utime = [];
        this.utime_steps = [];

        // Configure lightmap
        const enable = JPC.parseNoteToBoolean($dataMap.note, 'lightmap.enable');
        JPC.lightmap.enable = enable !== null ? enable : false;
        const isPlayerLightSrc = JPC.parseNoteToBoolean($dataMap.note, 'lightmap.player.is_light_source');
        JPC.lightmap.Player.isLightSrc = isPlayerLightSrc !== null ? isPlayerLightSrc : false;
        const playerLightRadius = JPC.parseNoteToFloat($dataMap.note, 'lightmap.player.light_radius');
        JPC.lightmap.Player.lightRadius = playerLightRadius !== null ? playerLightRadius : this.defaultLightRadius;
        const playerPerspective = JPC.parseNoteToFloat($dataMap.note, 'lightmap.player.perspective');
        JPC.lightmap.Player.perspective = playerPerspective !== null ? playerPerspective : 30.0;
        const playerSpotLightRadius = JPC.parseNoteToFloat($dataMap.note, 'lightmap.player.spotlight_radius');
        JPC.lightmap.Player.spotLightRadius = playerSpotLightRadius !== null ? playerSpotLightRadius : 256.0;
        // Setup light type for Player
        this.lightmap.uniforms.lightType[0] = 0b00;
        var isPointLight = JPC.parseNoteToBoolean($dataMap.note, 'lightmap.player.lighttype.is_point_light');
        this.lightmap.uniforms.lightType[0] |= isPointLight === true ? 0b01 : 0b00;
        var isSpotLight = JPC.parseNoteToBoolean($dataMap.note, 'lightmap.player.lighttype.is_spotlight');
        this.lightmap.uniforms.lightType[0] |= isSpotLight === true ? 0b10 : 0b00;
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.lightmap.enabled = JPC.lightmap.enable;
        if (this.lightmap.enabled == true)
            this.lightmapUpdateHandler(this);
    };
})();

/* MIT License

Copyright (c) 2020 Jim00000

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
