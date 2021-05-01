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

export const __input = {};
import {default as vkeys} from './vkeys.js'
import {default as JPCMapInput} from './JPCMapInput.js'
import {default as JPCTitleInput} from './JPCTitleInput.js'

__input.vkeys = vkeys;
__input.mapInput = JPCMapInput.instance;
__input.titleInput = JPCTitleInput.instance;

////////////////////////////////////////////
/////               Hook               /////
////////////////////////////////////////////

const _Scene_Map__updateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function() {
    _Scene_Map__updateScene.apply(this, arguments);
    __input.mapInput.update();
};

const _Scene_Title__update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    _Scene_Title__update.apply(this, arguments);
    __input.titleInput.update();
};