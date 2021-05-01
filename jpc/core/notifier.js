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

import {JPCNotifier as JPCNotifier, createDefaultStyleInitializer as createDefaultStyleInitializer} from './JPCNotifier.js';

export const __notifier = {};

// This is reserved for customized style setting.
// Users should define their own's style.
__notifier.customizedStyleInitializer = undefined;

__notifier.notify = function(msg, duration = 3000) {
    if (__instance !== undefined && __instance !== null) {
        __instance.notify(msg, duration)
    }
};

function resetNotifierPixiText() {
    const initializer = __notifier.customizedStyleInitializer ?? createDefaultStyleInitializer;
    __instance.pixiText = new PIXI.Text('', initializer());
};

////////////////////////////////////////////
/////               Hook               /////
////////////////////////////////////////////

const _Scene_Base__initialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
    _Scene_Base__initialize.apply(this, arguments);
    this._IsJPCNotifierInitialized = false;
};

const _Scene_Base__update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    _Scene_Base__update.apply(this, arguments);
    if (this._IsJPCNotifierInitialized === false) {
        resetNotifierPixiText();
        this.addChild(__instance.pixiText);
        this._IsJPCNotifierInitialized = true;
    } else {
        __instance.update();
    }
};

const __instance = new JPCNotifier.prototype.build();