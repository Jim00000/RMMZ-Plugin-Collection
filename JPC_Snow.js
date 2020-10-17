//=============================================================================
// RPG Maker MZ - Snow
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Snow weather effect (WIP)
 * @author Jim00000
 * @url
 * @base JPC_Core
 * @help
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JPC_Snow';
    const SNOW_SHADER_PATH = 'js/plugins/shaders/snow.fs';

    class Snow {
        constructor() {
            this.particleCount = 256;
            this.positions = [];
            this.opacity = [];
            this.utime = 0.0;

            for (let i = 0; i < this.particleCount; i++) {
                this.positions.push(
                    $dataMap.width * $gameMap.tileWidth() * Math.random() - $gameMap.displayX() * $gameMap.tileWidth() +
                    $gameMap.tileWidth() * 7);
                this.positions.push(
                    $dataMap.height * $gameMap.tileHeight() * Math.random() -
                    $gameMap.displayY() * $gameMap.tileHeight() + $gameMap.tileHeight() * 7);
                this.opacity.push(0.0);
            }

            this.filter = this.createFilter();
        };
    };

    Snow.prototype.update = function() {
        this.filter.uniforms.uTime += 0.0005;
        for (let i = 0; i < this.particleCount; i++) {
            this.filter.uniforms.opacity[i] = this.opacity[i];
            this.filter.uniforms.positions[i * 2] = this.positions[i * 2] - $gameMap.displayX() * $gameMap.tileWidth();
            this.filter.uniforms.positions[i * 2 + 1] =
                this.positions[i * 2 + 1] - $gameMap.displayY() * $gameMap.tileHeight();
            this.positions[i * 2 + 1] += 2.0;
            this.opacity[i] = Math.min(this.opacity[i] + 2 * 1e-3, 1.0);
            if (this.filter.uniforms.positions[i * 2 + 1] >
                ($dataMap.height - $gameMap.displayY()) * $gameMap.tileHeight()) {
                this.positions[i * 2 + 1] = $dataMap.height * $gameMap.tileHeight() * Math.random() -
                    $gameMap.displayY() * $gameMap.tileHeight();
                this.opacity[i] = 0.0;
            }
        }
    };

    Snow.prototype.createFilter = function() {
        const filter = JPC.createFilter(SNOW_SHADER_PATH, {
            uImg: PIXI.Texture.from('js/plugins/assets/Snow100.png'),
            uTime: 0.0,
            size: this.particleCount,
            positions: this.positions,
            opacity: this.opacity
        });
        return filter;
    };

    //=============================================================================
    // Hook
    //=============================================================================
    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.snow = new Snow();
        this.filters.push(this.snow.filter);
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.snow.update();
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
