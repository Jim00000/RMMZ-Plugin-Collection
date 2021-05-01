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

export default class JPCNotifierScheduler {
    #_working
    #_maximum_working
    #_waiting

    constructor() {
        this.#_working = [];
        this.#_waiting = [];
        this.#_maximum_working = 10;
    };

    get maximum_working_size() {
        return this.#_maximum_working;
    };

    get working() {
        return this.#_working;
    };

    set working(working) {
        return this.#_working = working;
    };

    get waiting() {
        return this.#_waiting;
    };
};

JPCNotifierScheduler.prototype.update = function(timestamp) {
    let newworking = [];
    for (let i = 0; i < this.working.length; i++) {
        this.working[i].update(timestamp);
        if (this.working[i].isExpired() === false) {
            newworking.push(this.working[i]);
        }
    }

    this.working = newworking;

    while (this.waiting.length > 0 && this.working.length < this.maximum_working_size) {
        const request = this.waiting.shift();
        this.working.push(request);
    }
};

JPCNotifierScheduler.prototype.getShownText = function() {
    let outputText = '';
    for (let i = 0; i < this.working.length; i++) {
        outputText += (this.working[i].showntext + '\n');
    }
    return outputText;
};

JPCNotifierScheduler.prototype.submit = function(request) {
    if (this.working.length < this.maximum_working_size) {
        this.working.push(request);
    } else {
        this.waiting.push(request);
    }
};