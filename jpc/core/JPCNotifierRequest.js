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

export default class JPCNotifierRequest {
    #_text
    #_showntext
    #_duration
    #_timestamp
    #_counter
    #_isStartStageTerminated
    #_isEndStageTerminated
    #_default_counter

    constructor(text, timestamp, duration) {
        this.#_text = text;
        this.#_showntext = '';
        this.#_timestamp = timestamp;
        this.#_duration = duration;
        this.#_default_counter = 2;
        this.#_counter = this.#_default_counter;
        this.#_isStartStageTerminated = false;
        this.#_isEndStageTerminated = false;
    };

    get text() {
        return this.#_text;
    };

    get showntext() {
        return this.#_showntext;
    };

    set showntext(text) {
        this.#_showntext = text;
    };

    get default_counter() {
        return this.#_default_counter;
    }

    get counter() {
        return this.#_counter;
    };

    set counter(counter) {
        this.#_counter = counter;
    };

    get duration() {
        return this.#_duration;
    };

    set duration(duration) {
        this.#_duration = duration;
    };

    get latest_timestamp() {
        return this.#_timestamp;
    };

    set latest_timestamp(timestamp) {
        this.#_timestamp = timestamp;
    };

    get isStartStageTerminated() {
        return this.#_isStartStageTerminated;
    };

    set isStartStageTerminated(boolean) {
        this.#_isStartStageTerminated = boolean;
    };

    get isEndStageTerminated() {
        return this.#_isEndStageTerminated;
    };

    set isEndStageTerminated(boolean) {
        this.#_isEndStageTerminated = boolean;
    };
};

JPCNotifierRequest.prototype.builder = function(text, duration) {
    const timestamp = new Date().getTime();
    return new JPCNotifierRequest(text, timestamp, duration);
};

JPCNotifierRequest.prototype.isExpired = function() {
    return this.isStartStageTerminated && this.isEndStageTerminated;
};

JPCNotifierRequest.prototype.update = function(timestamp) {
    const elapsed = timestamp - this.latest_timestamp;
    this.latest_timestamp = timestamp;
    if (this.isStartStageTerminated === false) {
        if (this.showntext.length < this.text.length) {
            if (this.counter > 0) {
                this.counter -= 1;
            } else {
                this.counter = this.default_counter;
                this.showntext += this.text[this.showntext.length];
            }
        } else {
            this.showntext = this.text;
            this.isStartStageTerminated = true;
        }
    } else if (this.isStartStageTerminated === true && this.isEndStageTerminated === false && this.duration > 0) {
        this.duration -= elapsed;
    } else if (this.isStartStageTerminated === true && this.isEndStageTerminated === false) {
        if (this.showntext.length > 0) {
            if (this.counter > 0) {
                this.counter -= 1;
            } else {
                this.counter = this.default_counter;
                this.showntext = this.showntext.substring(0, this.showntext.length - 1);
            }
        } else {
            this.isEndStageTerminated = true;
        }
    }
};