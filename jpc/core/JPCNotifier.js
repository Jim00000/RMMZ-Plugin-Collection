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

import {default as JPCNotifierRequest} from './JPCNotifierRequest.js';
import {default as JPCNotifierScheduler} from './JPCNotifierScheduler.js';

export function createDefaultStyleInitializer() {
    // https://pixijs.io/pixi-text-style/
    return new PIXI.TextStyle({
        fill: 'white',
        fontFamily: 'Tahoma',
        fontSize: 20,
        letterSpacing: 2,
        lineJoin: 'bevel',
        miterLimit: 5,
        strokeThickness: 4
    });
};

export class JPCNotifier {
    #_scheduler
    #_pixitext

    constructor(scheduler) {
        this.#_scheduler = scheduler;
        this.#_pixitext = new PIXI.Text('', createDefaultStyleInitializer());
    };

    get scheduler() {
        return this.#_scheduler;
    };

    get pixiText() {
        return this.#_pixitext;
    };

    set pixiText(pixitext) {
        this.#_pixitext = pixitext;
    };
};

JPCNotifier.prototype.update = function() {
    const timestamp = new Date().getTime();
    this.scheduler.update(timestamp);
    this.refresh();
};

JPCNotifier.prototype.refresh = function() {
    this.pixiText._text = this.scheduler.getShownText();
    this.pixiText.x = 5;
    this.pixiText.updateText();
};

JPCNotifier.prototype.notify = function(text, duration) {
    const request = JPCNotifierRequest.prototype.builder(text, duration);
    this.scheduler.submit(request);
};

JPCNotifier.prototype.build = function() {
    const scheduler = new JPCNotifierScheduler();
    return new JPCNotifier(scheduler);
};