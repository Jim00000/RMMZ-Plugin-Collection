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

import {default as JPCFogController} from './JPCFogController.js';
import {default as JPCFogConfig} from './JPCFogConfig.js';

export const __fog = {};

let _aliasFogController = undefined;

__fog.setMoveSpeedX = function(x) {
    if (_aliasFogController) {
        _aliasFogController.moveSpeedx = x;
    }
};

__fog.setMoveSpeedY = function(y) {
    if (_aliasFogController) {
        _aliasFogController.moveSpeedY = y;
    }
};

__fog.setMoveSpeed = function(x, y) {
    __fog.setMoveSpeedX(x);
    __fog.setMoveSpeedY(y);
};

__fog.setOpacity = function(opacity) {
    _aliasFogController.opacity = opacity;
};

__fog.setColor = function(color) {
    _aliasFogController.color = color;
};

__fog.enable = function() {
    if (_aliasFogController) {
        _aliasFogController.filter.enabled = true;
    }
};

__fog.disable = function() {
    if (_aliasFogController) {
        _aliasFogController.filter.enabled = false;
    }
};

function buildFogController() {
    const newinstance = new JPCFogController();
    _aliasFogController = newinstance;
    return newinstance;
};

////////////////////////////////////////////
/////               Hook               /////
////////////////////////////////////////////

var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function() {
    _Spriteset_Map__initialize.apply(this, arguments);
    this.fogController = buildFogController();
    this.fogController.config(new JPCFogConfig($dataMap.note));
    this.filters.push(this.fogController.filter);
};

var _Spriteset_Map__update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    _Spriteset_Map__update.apply(this, arguments);
    this.fogController.update();
};