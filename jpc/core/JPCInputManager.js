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

export default class JPCInputManager {
    #_keyEvents;
    #_keyMapper;

    constructor() {
        this.#_keyEvents = {};
        this.#_keyMapper = {};
    };

    get keyMapper() {
        return this.#_keyMapper;
    };

    get keyEvents() {
        return this.#_keyEvents;
    };
};

JPCInputManager.prototype.getKeyName = function(vkey) {
    return this.keyMapper[vkey];
};

JPCInputManager.prototype.register = function(vkey, keyName, handler, args = {}) {
    this.keyMapper[vkey] = keyName;
    this.keyEvents[keyName] = [handler, args];
    Input.keyMapper[vkey] = keyName;
};

JPCInputManager.prototype.unregister = function(vkey) {
    const keyName = this.keyMapper[vkey];
    delete this.keyMapper[vkey];
    delete Input.keyMapper[vkey];
    delete this.keyEvents[keyName];
};

JPCInputManager.prototype.clear = function() {
    for (const vkey in this.keyMapper) {
        this.unregister(vkey);
    }
};

JPCInputManager.prototype.update = function() {
    for (const vkey in this.keyMapper) {
        const keyName = this.keyMapper[vkey];
        if (!SceneManager.isSceneChanging()) {
            if (this.isTriggered(keyName)) {
                this.onHandleKeyEvent(keyName);
            }
        }
    }
};

JPCInputManager.prototype.isTriggered = function(keyName) {
    return Input.isTriggered(keyName);
};

JPCInputManager.prototype.onHandleKeyEvent = function(keyName) {
    const [handler, args] = this.keyEvents[keyName];
    if (handler instanceof Function) {
        handler(args);
    }
};