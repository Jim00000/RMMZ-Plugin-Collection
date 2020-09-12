//=============================================================================
// RPG Maker MZ - Fog
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add cloud effect to the map (WIP)
 * @author Jim00000
 * @url
 * @base JPC_Core
 * @help
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JPC_Cloud';
    const LIGHTMAP_SHADER_PATH = 'js/plugins/shaders/cloud.fs';
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    function createCloudFilter() {
        const fragShaderCode = JPC.loadGLSLShaderFile(LIGHTMAP_SHADER_PATH);
        const filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, fragShaderCode, {fMoveX: 0.0, fMoveY: 0.0});
        return filter;
    };

    function updateCloudFilter(spritest_map) {
        // update the position of the cloud map
        spritest_map.fMoveX += 0.0001;
        spritest_map.cloudFilter.uniforms.fMoveX =
            (0 - $gameMap.displayX() * $gameMap.tileWidth()) / ($gameMap.tileWidth() * 16) + spritest_map.fMoveX;
        spritest_map.cloudFilter.uniforms.fMoveY =
            (0 - $gameMap.displayY() * $gameMap.tileHeight()) / ($gameMap.tileHeight() * 12) + spritest_map.fMoveY;
    };

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.cloudFilter = createCloudFilter();
        this.filters.push(this.cloudFilter);
        this.fMoveX = 0.0;
        this.fMoveY = 0.0;
        this.cloudFilterUpdateHandler = updateCloudFilter;
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.cloudFilterUpdateHandler(this);
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
