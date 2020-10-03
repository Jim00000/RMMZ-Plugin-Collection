//=============================================================================
// RPG Maker MZ - Fog
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add fog effect to the map (WIP)
 * @author Jim00000
 * @url
 * @base JPC_Core
 * @help
 *
 * @param speed
 * @text move speed of fog (x, y)
 * @type number[]
 * @decimals 5
 * @default [0.00000, 0.00000]
 * @min 0.0
 *
 * @param fogcolor
 * @text fog color
 * @type number[]
 * @decimals 3
 * @default [1.000, 1.000, 1.000]
 * @min 0.0
 * @min 1.0
 *
 * @param opacity
 * @text opacity of fog 
 * @type number
 * @decimals 3
 * @default 0.500
 * @min 0.000
 * @min 1.000
 * 
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JPC_Fog';
    const LIGHTMAP_SHADER_PATH = 'js/plugins/shaders/fog.fs';
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    //=============================================================================
    // Parameters
    //=============================================================================
    const STR_SPEED_XY = JSON.parse(PLUGINPARAMS['speed']);
    const SPEED_XY = [parseFloat(STR_SPEED_XY[0]), parseFloat(STR_SPEED_XY[1])];
    const STR_FOG_COLOR = JSON.parse(PLUGINPARAMS['fogcolor']);
    const FOG_COLOR = [parseFloat(STR_FOG_COLOR[0]), parseFloat(STR_FOG_COLOR[1]), parseFloat(STR_FOG_COLOR[2])];
    const OPACITY = parseFloat(PLUGINPARAMS['opacity']);

    class Fog {
        constructor(moveSpeedX = 0.0, moveSpeedY = 0.0, opacity = 0.5) {
            this.fMoveX = Math.random() * 1000.0;
            this.fMoveY = Math.random() * 1000.0;
            this.fMoveSpeedX = moveSpeedX;
            this.fMoveSpeedY = moveSpeedY;
            this.opacity = opacity;
            this.fogColor = FOG_COLOR;
            this.cloudFilter = this.createCloudFilter();
        };

        get filter() {
            return this.cloudFilter;
        };

        get moveX() {
            return this.fMoveX;
        };

        get moveY() {
            return this.fMoveY;
        };

        get moveSpeedX() {
            return this.fMoveSpeedX;
        }

        get moveSpeedY() {
            return this.fMoveSpeedY;
        }

        set moveX(x) {
            this.fMoveX = x;
        };

        set moveY(y) {
            this.fMoveY = y;
        };

        update() {
            // update the position of the cloud map
            this.moveX += this.moveSpeedX;
            this.moveY += this.moveSpeedY;
            // update fog color
            this.filter.uniforms.fogColor = this.fogColor;
            // update fog opacity
            this.filter.uniforms.opacity = this.opacity;
            this.filter.uniforms.fMoveX = this.updateX();
            this.filter.uniforms.fMoveY = this.updateY();
        };
    };

    Fog.prototype.updateX = function() {
        return (0 - $gameMap.displayX() * $gameMap.tileWidth()) / ($gameMap.tileWidth() * 16) + this.moveX;
    };

    Fog.prototype.updateY = function() {
        return (0 - $gameMap.displayY() * $gameMap.tileHeight()) / ($gameMap.tileHeight() * 12) + this.moveY;
    };

    Fog.prototype.createCloudFilter = function() {
        const fragShaderCode = JPC.loadGLSLShaderFile(LIGHTMAP_SHADER_PATH);
        const filter = new PIXI.Filter(
            PIXI.Filter.defaultVertexSrc, fragShaderCode, {fMoveX: 0.0, fMoveY: 0.0, opacity: 0.5, fogColor: [1.0, 1.0, 1.0]});
        return filter;
    };

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.cloud = new Fog(SPEED_XY[0], SPEED_XY[1], OPACITY);
        this.filters.push(this.cloud.filter);
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.cloud.update();
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
