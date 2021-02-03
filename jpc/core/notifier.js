export var __notifier = {};

// Global instance of Window_JPCNotifier object.
// This instance's scope should be private to other modules.
__notifier.instance = null;

// builder
__notifier.build = function() {
    return new Window_JPCNotifier();
};

__notifier.notify = function(msg, duration = 3000) {
    if (__notifier.instance !== null) {
        if (__notifier.instance.parent !== null && (__notifier.instance.parent instanceof WindowLayer) === true) {
            __notifier.instance.submit(msg, duration);
        }
    }
};

//=============================================================================
// Window_JPCNotifier
//=============================================================================

let workingPipeline = [];
let waitingPipeline = [];

class Window_JPCNotifier extends Window_Base {
    // Private Instance Fields
    #maxWorkingQueueSize
    #isBusy
    #fontSize
    #duration

    constructor() {
        super(new Rectangle(-10, -20, 0, 0));
        this.#maxWorkingQueueSize = 10;
        this.#fontSize = 16;
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = this.fontSize;
        this.backOpacity = 0;
        this.opacity = 0;       // Disable background frame
        this.#duration = 3000;  // in milliseconds
        this.contentsOpacity = 0;
        this.#isBusy = false;
        this._isWindow = false;
        this.resetTimer();
        this.refresh();
        this.checkQueue();        
    };

    get maxWorkingQueueSize() {
        return this.#maxWorkingQueueSize;
    };

    get fontSize() {
        return this.#fontSize;
    };

    get isBusy() {
        return this.#isBusy;
    };

    get working() {
        return workingPipeline;
    };

    set working(array) {
        workingPipeline = array;
    };

    get waiting() {
        return waitingPipeline;
    };

    set isBusy(boolean) {
        this.#isBusy = boolean;
    };

    get duration() {
        return this.#duration;
    };

    set duration(duration) {
        this.#duration = duration;
    };
};

Window_JPCNotifier.prototype.checkQueue = function() {
    if(this.working.length > 0 || this.waiting.length > 0) {
        this.startNotification();
    }
}

Window_JPCNotifier.prototype.update = function() {
    Object.getPrototypeOf(this.constructor.prototype).update.call(this);  // call superclass's update
    if (this.isBusy) {
        if (this.isExpired() == false) {
            this.contentsOpacity += 8;
            this.refresh();
        } else {
            this.contentsOpacity -= 8;
            if (this.contentsOpacity <= 0) {
                this.contentsOpacity = 0;
                this.clearText();
                if (this.waiting.length > 0) {
                    var maxduration = 0;
                    // Move contents from waiting queue to working queue
                    while (this.waiting.length > 0 && this.working.length < this.maxWorkingQueueSize) {
                        const data = this.waiting.pop();
                        maxduration = Math.max(data.duration, maxduration);
                        this.working.unshift(data.text);
                    }
                    // restart the notification
                    this.duration = maxduration;
                    this.startNotification();
                } else {
                    this.isBusy = false;
                    this.move(-10, -20, 0, 0);
                }
            }
        }
    }
};

Window_JPCNotifier.prototype.drawTextEx = function(text, x, y, width) {
    this.contents.fontSize = this.fontSize;
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState);
    return textState.outputWidth;
};

Window_JPCNotifier.prototype.outputText = function() {
    var output = '';
    this.working.reverse().forEach((text) => {
        output += (text + '\n');
    });
    this.working.reverse();
    return output;
};

Window_JPCNotifier.prototype.resetTimer = function() {
    this._start_timestamp = new Date().getTime();
};

Window_JPCNotifier.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this.outputText(), 0, 0, this.innerWidth);
};

Window_JPCNotifier.prototype.isExpired = function() {
    const current_timestamp = new Date().getTime();
    return current_timestamp > (this._start_timestamp + this.duration);
};

Window_JPCNotifier.prototype.startNotification = function() {
    // We have height range about 5 line in maximum
    this.move(-10, -15, Graphics.boxWidth, Graphics.boxHeight);
    this.isBusy = true;
    this.contentsOpacity = 0;
    this.createContents();
    this.resetTimer();
    this.refresh();
};

Window_JPCNotifier.prototype.submit = async function(text, duration) {
    if (this.isBusy == false) {
        this.startNotification();
    }
    if (this.working.length >= this.maxWorkingQueueSize) {
        this.waiting.unshift({text: text, duration: duration});
    } else {
        this.resetTimer();
        this.duration = Math.max(this.duration, duration);
        this.working.unshift(text);
    }
};

Window_JPCNotifier.prototype.clearText = function() {
    this.working = [];
};

/* MIT License

Copyright (c) Jim00000

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