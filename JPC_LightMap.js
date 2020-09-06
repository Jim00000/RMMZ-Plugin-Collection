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

    JPC.lightmap = (() => {
        'use strict';
        var Exported = {};
        // Tell whether the light map is enabled
        Exported.enable = false;
        return Exported;
    })();

    PluginManager.registerCommand(PLUGIN_NAME, "set", args => {
        JPC.lightmap.enable = args.enable;
    });

    function createLightMap(_illumination, _radius) {
        const fragShaderCode = JPC.loadGLSLShaderFile(LIGHTMAP_SHADER_PATH).toString();
        const filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, fragShaderCode, {
            globalIllumination: _illumination,
            radius: _radius,
            lightsrc: [-9999999, -9999999],
        });
        return filter;
    }

    function updateLightMap(spritest_map) {
        if (spritest_map.playerSprite === null) {
            spritest_map.playerSprite = SceneManager._scene._spriteset._characterSprites.find(character =>
                character._characterName === $gamePlayer._characterName
            );
        } else {
            spritest_map.lightmap.uniforms.lightsrc[0] = spritest_map.playerSprite.position._x;
            spritest_map.lightmap.uniforms.lightsrc[1] = spritest_map.playerSprite.position._y;
        }
        spritest_map.lightmap.enabled = JPC.lightmap.enable;
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
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map__update.apply(this, arguments);
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