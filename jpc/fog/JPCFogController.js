/* MIT License

Copyright (c) 2021 Jim00000

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

'use strict';

export default class JPCFogController {
    #_MoveX
    #_MoveY
    #_MoveSpeedX
    #_MoveSpeedY
    #_FogColor
    #_FogFilter
    #_FogOpacity

    constructor(moveSpeedX = 0.0, moveSpeedY = 0.0, opacity = 0.5, fogColor = [1.0, 1.0, 1.0]) {
        this.#_MoveX = this.moveRandomizer();
        this.#_MoveY = this.moveRandomizer();
        this.#_MoveSpeedX = moveSpeedX;
        this.#_MoveSpeedY = moveSpeedY;
        this.#_FogOpacity = opacity;
        this.#_FogColor = fogColor;
        this.#_FogFilter = this.createFogFilter();
    };

    get filter() {
        return this.#_FogFilter;
    };

    get color() {
        return this.#_FogColor;
    };

    set color(color) {
        this.#_FogColor = color;
    };

    get moveX() {
        return this.#_MoveX;
    };

    set moveX(x) {
        this.#_MoveX = x;
    };

    set moveY(y) {
        this.#_MoveY = y;
    };

    get moveY() {
        return this.#_MoveY;
    };

    get opacity() {
        return this.#_FogOpacity;
    };

    set opacity(opacity) {
        this.#_FogOpacity = opacity;
    };

    get moveSpeed() {
        return [this.#_MoveSpeedX, this.#_MoveSpeedY];
    };

    get moveSpeedX() {
        return this.#_MoveSpeedX;
    };

    get moveSpeedY() {
        return this.#_MoveSpeedY;
    };

    set moveSpeed(xy) {
        [this.#_MoveSpeedX, this.#_MoveSpeedY] = xy;
    };

    set moveSpeedX(x) {
        this.#_MoveSpeedX = x;
    };

    set moveSpeedY(y) {
        this.#_MoveSpeedY = y;
    };
};

JPCFogController.prototype.config = function(conf) {
    this.opacity = conf.opacity ?? this.opacity;
    this.color = conf.color ?? this.color;
    this.moveSpeed = conf.moveSpeed ?? this.moveSpeed;
    this.filter.enabled = conf.enabled ?? this.filter.enabled;
    console.debug(this.moveSpeed);
};

JPCFogController.prototype.moveRandomizer = function() {
    return Math.random() * 1000.0;
};

JPCFogController.prototype.updateX = function() {
    return (0 - $gameMap.displayX() * $gameMap.tileWidth()) / ($gameMap.tileWidth() * 16) + this.moveX;
};

JPCFogController.prototype.updateY = function() {
    return (0 - $gameMap.displayY() * $gameMap.tileHeight()) / ($gameMap.tileHeight() * 12) + this.moveY;
};

JPCFogController.prototype.update = function() {
    // update enable
    if (this.filter.enabled === true) {
        // update the position of the fog
        this.moveX += this.moveSpeedX;
        this.moveY += this.moveSpeedY;
        // update fog color
        this.filter.uniforms.fogColor = this.color;
        // update fog opacity
        this.filter.uniforms.opacity = this.opacity;
        this.filter.uniforms.fMoveX = this.updateX();
        this.filter.uniforms.fMoveY = this.updateY();
    }
};

JPCFogController.prototype.createFogFilter = function() {
    const filter = JPC.core.glsl.createFilter(
        'js/plugins/jpc/shaders/fog.fs',
        {fMoveX: this.moveX, fMoveY: this.moveY, opacity: this.opacity, fogColor: this.color});
    filter.enabled = false;
    return filter;
};