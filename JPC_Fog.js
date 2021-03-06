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
    const FOG_SHADER_PATH = 'js/plugins/shaders/fog.fs';
    const PLUGIN_PARAMS = JPC.getPluginParams(PLUGIN_NAME);

    //=============================================================================
    // Parameters
    //=============================================================================
    const SPEED_XY = JPC.toGeneric(PLUGIN_PARAMS.speed).toFloatArray();
    const FOG_COLOR = JPC.toGeneric(PLUGIN_PARAMS.fogcolor).toFloatArray();
    const OPACITY = JPC.toGeneric(PLUGIN_PARAMS.opacity).toFloat();
    const FOG_SWITCH_ID = JPC.toGeneric(PLUGIN_PARAMS.gameswitchid).toFloat();

    class Fog {
        // Private Instance Fields
        // ------------------------------------------------------------------------------------------------------------
        // Until now, there are only a few browsers (Chrome 74+, Edge 79+, Opera 62+, etc.) supporting private instance
        // fields. There are compatibility issues across different browsers.
        // Reference:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
        #fMoveX
        #fMoveY
        #fMoveSpeedX
        #fMoveSpeedY
        #vFogColor
        #fogFilter
        #fOpacity

        constructor(moveSpeedX = 0.0, moveSpeedY = 0.0, opacity = 0.5, fogColor = [1.0, 1.0, 1.0]) {
            this.#fMoveX = this.moveRandomizer();
            this.#fMoveY = this.moveRandomizer();
            this.#fMoveSpeedX = moveSpeedX;
            this.#fMoveSpeedY = moveSpeedY;
            this.#fOpacity = opacity;
            this.#vFogColor = fogColor;
            this.#fogFilter = this.createFogFilter();
        };

        get filter() {
            return this.#fogFilter;
        };

        get color() {
            return this.#vFogColor;
        }

        get moveX() {
            return this.#fMoveX;
        }

        get moveY() {
            return this.#fMoveY;
        }

        get opacity() {
            return this.#fOpacity;
        }

        get moveSpeedX() {
            return this.#fMoveSpeedX;
        };

        get moveSpeedY() {
            return this.#fMoveSpeedY;
        };

        set moveSpeedX(x) {
            this.#fMoveSpeedX = x;
        };

        set moveSpeedY(y) {
            this.#fMoveSpeedY = y;
        };

        update() {
            // update enable
            this.filter.enabled = $gameSwitches.value(FOG_SWITCH_ID);
            if (this.filter.enabled === true) {
                // update the position of the fog
                this.#fMoveX += this.moveSpeedX;
                this.#fMoveY += this.moveSpeedY;
                // update fog color
                this.filter.uniforms.fogColor = this.color;
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

    Fog.prototype.createFogFilter = function() {
        const filter = JPC.createFilter(
            FOG_SHADER_PATH,
            {fMoveX: this.moveX, fMoveY: this.moveY, opacity: this.opacity, fogColor: this.color});
        return filter;
    };

    //=============================================================================
    // Hook
    //=============================================================================
    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.fog = new Fog(SPEED_XY[0], SPEED_XY[1], OPACITY, FOG_COLOR);
        this.filters.push(this.fog.filter);
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.fog.update();
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
