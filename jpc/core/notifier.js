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

export var __notifier = {};

__notifier.notify = function(msg, duration = 3000) {
    if (__instance !== undefined && __instance !== null) {
        __instance.notify(msg, duration)
    }
};

// This is reserved for customized style setting.
// Users should define their own's style.
__notifier.createCustomizedStyle = null;

function createDefaultStyle() {
    // https://pixijs.io/pixi-text-style/
    return new PIXI.TextStyle({
        fill: "white",
        fontFamily: "Tahoma",
        fontSize: 20,
        letterSpacing: 2,
        lineJoin: "bevel",
        miterLimit: 5,
        strokeThickness: 4
    });
}

function createStyle() {
    if(__notifier.createCustomizedStyle === undefined || __notifier.createCustomizedStyle === null) {
        return createDefaultStyle();
    } else {
        return __notifier.createCustomizedStyle();
    }
}

function resetNotifierPixiText() {
    __instance.pixiText = new PIXI.Text('', createStyle());
};

class JNotifierRequest {
    // Private Instance Fields
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

JNotifierRequest.prototype.builder = function(text, duration) {
    const timestamp = new Date().getTime();
    return new JNotifierRequest(text, timestamp, duration);
};

JNotifierRequest.prototype.isExpired = function() {
    return this.isStartStageTerminated && this.isEndStageTerminated;
};

JNotifierRequest.prototype.update = function(timestamp) {
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

class JNotifierScheduler {
    // Private Instance Fields
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

JNotifierScheduler.prototype.update = function(timestamp) {
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

JNotifierScheduler.prototype.getShownText = function() {
    let outputText = '';
    for (let i = 0; i < this.working.length; i++) {
        outputText += (this.working[i].showntext + '\n');
    }
    return outputText;
};

JNotifierScheduler.prototype.submit = function(request) {
    if (this.working.length < this.maximum_working_size) {
        this.working.push(request);
    } else {
        this.waiting.push(request);
    }
};

class JNotifier {
    // Private Instance Fields
    #_scheduler
    #_pixitext

    constructor(scheduler) {
        this.#_scheduler = scheduler;
        this.#_pixitext = new PIXI.Text('', createStyle());
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

JNotifier.prototype.update = function() {
    const timestamp = new Date().getTime();
    this.scheduler.update(timestamp);
    this.refresh();
};

JNotifier.prototype.refresh = function() {
    this.pixiText._text = this.scheduler.getShownText();
    this.pixiText.x = 5;
    this.pixiText.updateText();
};

JNotifier.prototype.notify = function(text, duration) {
    const request = JNotifierRequest.prototype.builder(text, duration);
    this.scheduler.submit(request);
};

JNotifier.prototype.build = function() {
    const scheduler = new JNotifierScheduler();
    return new JNotifier(scheduler);
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

// Private notifier object.
const __instance = new JNotifier.prototype.build();
