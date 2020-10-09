//=============================================================================
// RPG Maker MZ - Lighting
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add lighting effect (WIP)
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_Lighting.js
 * @base JPC_Core
 * @help
 *
 * This script adds point light or spotlight effect to the player or objects on the map. You can add
 * following tags in the map's note to configure parameters of lighting :
 *
 * <jpc>
 *   <lighting>
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
 *   </lighting>
 * </jpc>
 *
 * To make a object become glowable, in the event editor, fill following data
 * into the note textbox :
 *
 * <jpc>
 *   <lighting>
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
 *   </lighting>
 * </jpc>
 *
 * You had better remove all of newline character ('\n', input "Enter" button
 * to end cuurent line) because only a few lines in the note textbox remains
 * (the other parts will be cut off) in the event editor in RMMZ editor.
 *
 * e.g. <jpc><lighting><lightobj>true...</jpc> and put it in the
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

    const PLUGIN_NAME = 'JPC_Lighting';
    const LIGHTING_SHADER_PATH = 'js/plugins/shaders/lighting.fs';
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    //=============================================================================
    // Parameters
    //=============================================================================
    const ILLUMINATION = parseFloat(PLUGINPARAMS.default_global_illumination);
    const LIGHT_RADIUS = parseFloat(PLUGINPARAMS.default_light_radius);
    const MAX_LIGHTS = 32;  // This value must be consistent with the macro defined in the the lighting.fs shader file.

    class Lighting {
        constructor() {
            const radius = JPC.parseNoteToFloat($dataMap.note, 'lighting.light_radius');
            this.pointLightRadius = JPC.select(radius, LIGHT_RADIUS);
            const illumination = JPC.parseNoteToFloat($dataMap.note, 'lighting.global_illumination');
            this.globalIllumination = JPC.select(illumination, ILLUMINATION);
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
            this.filter = this.createLightingFilter(this.globalIllumination);  // lighting filter

            // Configure Player
            this.Player = {isLightSrc: false, lightRadius: 0.0, perspective: 0.0, spotLightRadius: 0.0};

            // Configure lighting
            const enable = JPC.parseNoteToBoolean($dataMap.note, 'lighting.enable');
            this.filter.enabled = JPC.select(enable, false);
            const isPlayerLightSrc = JPC.parseNoteToBoolean($dataMap.note, 'lighting.player.is_light_source');
            this.Player.isLightSrc = JPC.select(isPlayerLightSrc, false);
            const playerLightRadius = JPC.parseNoteToFloat($dataMap.note, 'lighting.player.light_radius');
            this.Player.lightRadius = JPC.select(playerLightRadius, this.pointLightRadius);
            const playerPerspective = JPC.parseNoteToFloat($dataMap.note, 'lighting.player.perspective');
            this.Player.perspective = JPC.select(playerPerspective, 30.0);
            const playerSpotLightRadius = JPC.parseNoteToFloat($dataMap.note, 'lighting.player.spotlight_radius');
            this.Player.spotLightRadius = JPC.select(playerSpotLightRadius, 256.0);
            // Setup light type for Player
            this.filter.uniforms.lightType[0] = 0b00;
            let isPointLight = JPC.parseNoteToBoolean($dataMap.note, 'lighting.player.lighttype.is_point_light');
            this.filter.uniforms.lightType[0] |= isPointLight === true ? 0b01 : 0b00;
            let isSpotLight = JPC.parseNoteToBoolean($dataMap.note, 'lighting.player.lighttype.is_spotlight');
            this.filter.uniforms.lightType[0] |= isSpotLight === true ? 0b10 : 0b00;
        };
    };

    Lighting.prototype.lightDirectionStringToIndex = function(string) {
        let code = 0;
        switch (string) {
            case 'down':
                code = Game_Character.ROUTE_MOVE_DOWN;
                break;
            case 'left':
                code = Game_Character.ROUTE_MOVE_LEFT;
                break;
            case 'right':
                code = Game_Character.ROUTE_MOVE_RIGHT;
                break;
            case 'up':
                code = Game_Character.ROUTE_MOVE_UP;
                break;
            default:
                throw new Error(
                    `No such light direction type "${string}" (${PLUGIN_NAME}.js:lightDirectionStringToIndex)`);
        }
        return code << 1;
    };

    Lighting.prototype.createLightingFilter = function() {
        const filter = JPC.createFilter(LIGHTING_SHADER_PATH, {
            globalIllumination: this.globalIllumination,
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

    Lighting.prototype.findPlayerSprite = function() {
        return SceneManager._scene._spriteset._characterSprites.find(
            character => character._character instanceof Game_Player);
    };

    Lighting.prototype.configLightObjects = function() {
        SceneManager._scene._spriteset._characterSprites.forEach(character => {
            if (character._character !== undefined && character._character instanceof Game_Event &&
                character.isEmptyCharacter() === false) {
                const eventId = character._character._eventId;
                const note = $dataMap.events[eventId].note
                // Skip event whose note is empty and verify that this is a light object
                if ($dataMap.events[eventId].note.length > 0 &&
                    JPC.parseNoteToBoolean(note, 'lighting.lightobj') === true) {
                    // Append to the light object list
                    this.lightObjPos.push(character.position);
                    // Append to ambient color list
                    let r = JPC.parseNoteToFloat(note, 'lighting.r');
                    let g = JPC.parseNoteToFloat(note, 'lighting.g');
                    let b = JPC.parseNoteToFloat(note, 'lighting.b');
                    this.ambientColor.push({r: JPC.select(r, 1.0), g: JPC.select(g, 1.0), b: JPC.select(b, 1.0)});
                    // Append radius for each object
                    let _radius = JPC.parseNoteToFloat(note, 'lighting.radius');
                    this.lightRadius.push(JPC.select(_radius, this.pointLightRadius));
                    // Append lighttype
                    let _isPointLight = JPC.parseNoteToBoolean(note, 'lighting.lighttype.is_point_light');
                    let isPointLight = JPC.select(_isPointLight, false);
                    let _isSpotLight = JPC.parseNoteToBoolean(note, 'lighting.lighttype.is_spotlight');
                    let isSpotLight = JPC.select(_isSpotLight, false);
                    let encodedLightType = 0b00;
                    encodedLightType |= isPointLight === true ? 0b01 : 0b00;
                    encodedLightType |= isSpotLight === true ? 0b10 : 0b00;
                    this.lightTypes.push(encodedLightType);
                    // Append light direction index
                    let _lightDirString = JPC.parseNote(note, 'lighting.light_direction');
                    let lightDirString = JPC.select(_lightDirString, 'down');
                    let lightDirIdx = this.lightDirectionStringToIndex(lightDirString);
                    this.lightDirIdx.push(lightDirIdx);
                    // Append perspective for spotlight
                    let _perspective = JPC.parseNoteToFloat(note, 'lighting.perspective');
                    let perspective = JPC.select(_perspective, 15.0);
                    this.perspective.push(perspective);
                    // Append spotlight radius for spotlight
                    let _spotlightRadius = JPC.parseNoteToFloat(note, 'lighting.spotlight_radius');
                    let spotlightRadius = JPC.select(_spotlightRadius, 300.0);
                    this.spotlightRadius.push(spotlightRadius);
                    // Append utime
                    let _utime = Math.random();
                    this.utime.push(_utime);
                    _utime = 0.4 + 0.6 * (Math.random() - 0.5);
                    this.utime_steps.push(_utime);
                }
            }
        });
    };

    Lighting.prototype.config = function() {
        // Find Player's sprite
        if (this.playerSprite === null) {
            this.playerSprite = this.findPlayerSprite();
        }

        // Find game events which represents light source
        if (this.isLightSrcFound === false) {
            // Configure parameters for light objects
            this.configLightObjects();

            // Check whether the size is consistent
            if (this.lightObjPos.length !== this.ambientColor.length) {
                Graphics.printError(
                    PLUGIN_NAME + '.js : ' + new Error().lineNumber,
                    'size of lightObjPos is not equal to ambientColor');
            }

            // Check whether the size is consistent
            if (this.ambientColor.length !== this.lightRadius.length) {
                Graphics.printError(
                    PLUGIN_NAME + '.js : ' + new Error().lineNumber,
                    'size of ambientColor is not equal to lightRadius');
            }

            // Update light source' count
            // One more count is for player
            this.filter.uniforms.lightSrcSize = this.lightObjPos.length + 1;

            this.isLightSrcFound = true;
        }
    };

    Lighting.prototype.update = function() {
        if (this.filter.enabled === true) {
            this.config();
            this.updatePlayer();
            this.updateLightObjects();
            this.updateGlobalIllumination();
        }
    };

    Lighting.prototype.updatePlayer = function() {
        if (this.Player.isLightSrc === true) {
            // Update player's position
            this.filter.uniforms.lightsrc[0] = this.playerSprite.position._x;
            this.filter.uniforms.lightsrc[1] = this.playerSprite.position._y;
            // Update player's ambient color
            this.filter.uniforms.ambientColor[0] = 1.0;
            this.filter.uniforms.ambientColor[1] = 1.0;
            this.filter.uniforms.ambientColor[2] = 1.0;
            // Update player's light radius
            this.filter.uniforms.lightRadius[0] = this.Player.lightRadius;
            // Update player's perspective direction
            this.filter.uniforms.lightDirIdx[0] = $gamePlayer.direction();
            // Update player's perspective angle in degree
            this.filter.uniforms.perspective[0] = this.Player.perspective;
            // Update player's spotlight radius
            this.filter.uniforms.fSpotlightRadius[0] = this.Player.spotLightRadius;
            // Update player's uTime
            this.filter.uniforms.uTime[0] += this.utime_steps[0];
        } else {
            // Move light source of player out of the screen
            this.filter.uniforms.lightsrc[0] = -99999;
            this.filter.uniforms.lightsrc[1] = -99999;
        }
    };

    Lighting.prototype.updateLightObjects = function() {
        // Loop to update every light object
        for (let i = 0; i < this.lightObjPos.length; i++) {
            // Update light source's position
            var dx = (this.lightObjPos[i]._x - this.playerSprite.position._x) * $gameScreen._zoomScale;
            var dy = (this.lightObjPos[i]._y - this.playerSprite.position._y) * $gameScreen._zoomScale;
            this.filter.uniforms.lightsrc[2 + 2 * i + 0] = dx + this.playerSprite.position._x;
            this.filter.uniforms.lightsrc[2 + 2 * i + 1] = dy + this.playerSprite.position._y;
            // Update ambient color
            this.filter.uniforms.ambientColor[3 + 3 * i + 0] = this.ambientColor[i].r;
            this.filter.uniforms.ambientColor[3 + 3 * i + 1] = this.ambientColor[i].g;
            this.filter.uniforms.ambientColor[3 + 3 * i + 2] = this.ambientColor[i].b;
            // Update light radius
            this.filter.uniforms.lightRadius[1 + i] = this.lightRadius[i];
            // Update light type
            this.filter.uniforms.lightType[1 + i] = this.lightTypes[i];
            // Update light direction index
            this.filter.uniforms.lightDirIdx[1 + i] = this.lightDirIdx[i];
            // Update perspective for spotlight
            this.filter.uniforms.perspective[1 + i] = this.perspective[i];
            // Update spotlightRadius for spotlight
            this.filter.uniforms.fSpotlightRadius[1 + i] = this.spotlightRadius[i];
            // Update uTime
            this.filter.uniforms.uTime[1 + i] += this.utime_steps[i];
        }
    };

    Lighting.prototype.updateGlobalIllumination = function() {
        this.filter.uniforms.globalIllumination = this.globalIllumination;
    };

    //=============================================================================
    // Hook
    //=============================================================================
    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.lighting = new Lighting();
        this.filters.push(this.lighting.filter);
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.lighting.update();
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
