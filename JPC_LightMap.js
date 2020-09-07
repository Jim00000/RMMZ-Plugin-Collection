//=============================================================================
// RPG Maker MZ - Light Map
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add light map effect
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
 *     <lightmap_radius>300.0</lightmap_radius>
 *   </lightmap>
 * </jpc>
 * 
 * Also, you can use plugin command to enable or disable the lightmap effect :
 * · set : set to enable or disable the lightmap effect.
 * 
 * To make a object become glowable, in the event editor, fill following data 
 * into the note textbox :
 * 
 * <jpc>
 *   <lightmap>
 *     <lightobj>true</lightobj>
 *   </lightmap>
 * </jpc>
 * 
 * Note that there are at most 32 light objects allowed in a map due to in 
 * consideration for the performance.
 * 
 * @param lightmap_radius
 * @text The radius of the light map.
 * @type number
 * @default 256.0
 * @min 0.0
 * 
 * @param global_illumination
 * @text Global illumination for the environment.
 * @type number
 * @default 0.0
 * @min 0.0
 * @max 1.0
 * 
 * @command set
 * @text set
 * @desc set to enable/disable lightmap effect.
 *
 * @arg enable
 * @type boolean
 * @text enable
 * @desc enable the lightmap effect or not.
 * @default true
 */

(() => {
    'use strict';

    const PLUGIN_NAME = "JPC_LightMap";
    const LIGHTMAP_SHADER_PATH = "js/plugins/shaders/lightmap.fs";
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    const ILLUMINATION = parseFloat(PLUGINPARAMS['global_illumination']);
    const LIGHTMAP_RADIUS = parseFloat(PLUGINPARAMS['lightmap_radius']);
    const MAX_LIGHTS = 32; // This value must be consistent with the macro value defined in the the lightmap.fs shader file.

    JPC.lightmap = (() => {
        'use strict';
        var Exported = {};
        // Tell whether the light map is enabled
        Exported.enable = true;
        return Exported;
    })();

    PluginManager.registerCommand(PLUGIN_NAME, "set", args => {
        JPC.lightmap.enable = args.enable;
    });

    function createLightMap(_illumination, _radius) {
        const fragShaderCode = JPC.loadGLSLShaderFile(LIGHTMAP_SHADER_PATH).toString();
        const filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, fragShaderCode, {
            globalIllumination: _illumination,
            lightRadius: _radius,
            lightSrcSize: 0,
            lightsrc: new Float32Array(MAX_LIGHTS * 2),
            ambientColor: new Float32Array(MAX_LIGHTS * 3)
        });
        return filter;
    }

    function updateLightMap(spritest_map) {
        // Find Player's sprite
        if (spritest_map.playerSprite === null) {
            spritest_map.playerSprite = SceneManager._scene._spriteset._characterSprites.find(character =>
                character._character instanceof Game_Player
            );
        }

        // Find game events which represents light source
        if (spritest_map.isLightSrcFound === false) {
            SceneManager._scene._spriteset._characterSprites.forEach(character => {
                if (character._character !== undefined && character._character instanceof Game_Event &&
                    character.isEmptyCharacter() === false) {
                    const eventId = character._character._eventId;
                    const note = $dataMap.events[eventId].note
                    // Skip event whose note is empty and verify that this is a light object
                    if ($dataMap.events[eventId].note.length > 0 &&
                        JPC.parseNoteToBoolean(note, "lightmap.lightobj") === true) {
                        // Append to the light object list
                        spritest_map.lightObjPos.push(character.position);
                        var r = JPC.parseNoteToFloat(note, "lightmap.r");
                        var g = JPC.parseNoteToFloat(note, "lightmap.g");
                        var b = JPC.parseNoteToFloat(note, "lightmap.b");
                        spritest_map.ambientColor.push({
                            r: r != null ? r : 1.0,
                            g: g != null ? g : 1.0,
                            b: b != null ? b : 1.0
                        });
                    }
                }
            });
            spritest_map.isLightSrcFound = true;
        }

        if (this.isPlayerLightSrc === true) {
            // Update player's position
            spritest_map.lightmap.uniforms.lightsrc[0] = spritest_map.playerSprite.position._x;
            spritest_map.lightmap.uniforms.lightsrc[1] = spritest_map.playerSprite.position._y;
            // Update player's ambient color
            spritest_map.lightmap.uniforms.ambientColor[0] = 1.0;
            spritest_map.lightmap.uniforms.ambientColor[1] = 1.0;
            spritest_map.lightmap.uniforms.ambientColor[2] = 1.0;
        } else {
            // Move light source of player out of the screen
            spritest_map.lightmap.uniforms.lightsrc[0] = -99999;
            spritest_map.lightmap.uniforms.lightsrc[1] = -99999;
        }

        // Check whether the size is consistent
        if (spritest_map.lightObjPos.length !== spritest_map.ambientColor.length) {
            Graphics.printError(
                PLUGIN_NAME + ".js : " + new Error().lineNumber,
                "size of lightObjPos is not equal to ambientColor"
            );
        }

        if (spritest_map.lightObjPos.length > 0) {
            // Loop to update every light object
            for (let i = 0; i < spritest_map.lightObjPos.length; i++) {
                // Update light source's position
                spritest_map.lightmap.uniforms.lightsrc[2 + 2 * i + 0] = spritest_map.lightObjPos[i]._x;
                spritest_map.lightmap.uniforms.lightsrc[2 + 2 * i + 1] = spritest_map.lightObjPos[i]._y;
                // Update ambient color
                spritest_map.lightmap.uniforms.ambientColor[3 + 3 * i + 0] = spritest_map.ambientColor[i].r;
                spritest_map.lightmap.uniforms.ambientColor[3 + 3 * i + 1] = spritest_map.ambientColor[i].g;
                spritest_map.lightmap.uniforms.ambientColor[3 + 3 * i + 2] = spritest_map.ambientColor[i].b;
            }
        }

        // Update light source' count
        // One more count is for player
        spritest_map.lightmap.uniforms.lightSrcSize = spritest_map.lightObjPos.length + 1;
    }

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function () {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.lightmap = createLightMap(
            JPC.parseNoteToFloat($dataMap.note, "lightmap.global_illumination") || ILLUMINATION,
            JPC.parseNoteToFloat($dataMap.note, "lightmap.lightmap_radius") || LIGHTMAP_RADIUS
        );
        this.filters.push(this.lightmap);
        this.lightmapUpdateHandler = updateLightMap;
        this.playerSprite = null;
        this.isPlayerLightSrc = true;
        this.isLightSrcFound = false; // do not modify this
        this.lightObjPos = []; // light object's position
        this.ambientColor = [];
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map__update.apply(this, arguments);
        this.lightmap.enabled = JPC.lightmap.enable;
        if (this.lightmap.enabled === true) {
            this.lightmapUpdateHandler(this);
        }
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