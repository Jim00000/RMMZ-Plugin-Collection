//=============================================================================
// RPG Maker MZ - Light Map
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add light map effect
 * @author Jim00000
 * @url 
 * @base JPC_Core
 * @help 
 * 
 */

(() => {
    'use strict';

    const PLUGIN_NAME = "jpc_lightmap";
    const LIGHTMAP_SHADER_PATH = "js/plugins/shaders/lightmap.fs";
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    function createLightMap() {
        const fragShaderCode = JPC.loadGLSLShaderFile(LIGHTMAP_SHADER_PATH).toString();
        const filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, fragShaderCode, {
            minfactor: 0.0,
            radius: 256.0,
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
    }

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function () {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.lightmap = createLightMap();
        this.filters.push(this.lightmap);
        this.playerSprite = null;
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map__update.apply(this, arguments);
        updateLightMap(this);
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