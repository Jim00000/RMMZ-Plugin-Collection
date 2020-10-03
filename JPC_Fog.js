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
 * @param gameswitchid
 * @text switch ID
 * @desc This switch id controls the fog effect is enabled or not.
 * @type number
 * @min 0
 *
 * @param speed
 * @text move speed of fog
 * @desc The movement speed of fog (x, y).
 * @type number[]
 * @decimals 5
 * @default [0.00000, 0.00000]
 * @min 0.0
 *
 * @param fogcolor
 * @text fog color
 * @desc This parameter configs the fog color in (R, G, B).
 * @type number[]
 * @decimals 3
 * @default [1.000, 1.000, 1.000]
 * @min 0.0
 * @min 1.0
 *
 * @param opacity
 * @text opacity
 * @desc This parameter controls the opacity of the fog effect.
 * @type number
 * @decimals 3
 * @default 0.500
 * @min 0.000
 * @min 1.000
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JPC_Fog';
    const LIGHTMAP_SHADER_PATH = 'js/plugins/shaders/fog.fs';
    const PLUGIN_PARAMS = JPC.getPluginParams(PLUGIN_NAME);

    //=============================================================================
    // Parameters
    //=============================================================================
    const SPEED_XY = JPC.toFloatArray(PLUGIN_PARAMS.speed);
    const FOG_COLOR = JPC.toFloatArray(PLUGIN_PARAMS.fogcolor);
    const OPACITY = parseFloat(PLUGIN_PARAMS.opacity);
    const FOG_SWITCH_ID = parseInt(PLUGIN_PARAMS.gameswitchid);

    class Fog {
        constructor(moveSpeedX = 0.0, moveSpeedY = 0.0, opacity = 0.5, fogColor = [1.0, 1.0, 1.0]) {
            this.fMoveX = this.moveRandomizer();
            this.fMoveY = this.moveRandomizer();
            this.fMoveSpeedX = moveSpeedX;
            this.fMoveSpeedY = moveSpeedY;
            this.opacity = opacity;
            this.fogColor = fogColor;
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
        };

        get moveSpeedY() {
            return this.fMoveSpeedY;
        };

        set moveX(x) {
            this.fMoveX = x;
        };

        set moveY(y) {
            this.fMoveY = y;
        };

        update() {
            // update enable
            this.filter.enabled = $gameSwitches.value(FOG_SWITCH_ID);
            if (this.filter.enabled === true) {
                // update the position of the cloud map
                this.moveX += this.moveSpeedX;
                this.moveY += this.moveSpeedY;
                // update fog color
                this.filter.uniforms.fogColor = this.fogColor;
                // update fog opacity
                this.filter.uniforms.opacity = this.opacity;
                this.filter.uniforms.fMoveX = this.updateX();
                this.filter.uniforms.fMoveY = this.updateY();
            }
        };
    };

    Fog.prototype.moveRandomizer = function() {
        return Math.random() * 1000.0;
    };

    Fog.prototype.updateX = function() {
        return (0 - $gameMap.displayX() * $gameMap.tileWidth()) / ($gameMap.tileWidth() * 16) + this.moveX;
    };

    Fog.prototype.updateY = function() {
        return (0 - $gameMap.displayY() * $gameMap.tileHeight()) / ($gameMap.tileHeight() * 12) + this.moveY;
    };

    Fog.prototype.createCloudFilter = function() {
        const filter = JPC.createFilter(
            LIGHTMAP_SHADER_PATH,
            {fMoveX: this.fMoveX, fMoveY: this.fMoveY, opacity: this.opacity, fogColor: this.fogColor});
        return filter;
    };

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.cloud = new Fog(SPEED_XY[0], SPEED_XY[1], OPACITY, FOG_COLOR);
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
