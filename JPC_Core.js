//=============================================================================
// RPG Maker MZ - JPC Core
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Essential core file for JPC plugin.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_Core.js
 * @help 
 * The plugin contains essential function and objects to support other JPC's 
 * plugins.
 * 
 * This script includes and handles : 
 * - A notifier : tell information or status to the player
 * - XML parsing 
 */

var JPC = (() => {
    'use strict';

    var Exported = {};
    Exported.notifier = null;

    // Virtual key codes (Partial)
    // This follows virtual-key codes in Windows develop center
    // https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
    Exported.vkeys = (() => {
        'use strict';
        var VK = {};
        VK.VK_LBUTTON = 0x01;   // Left mouse button
        VK.VK_RBUTTON = 0x02;   // Right mouse button
        VK.VK_CANCEL = 0x03;
        VK.VK_MBUTTON = 0x04;   // Middle mouse button
        VK.VK_XBUTTON1 = 0x05;  // X1 mouse button
        VK.VK_XBUTTON2 = 0x06;  // X2 mouse button
        VK.VK_BACK = 0x08;      // BACKSPACE
        VK.VK_TAB = 0x09;
        VK.VK_CLEAR = 0x0C;
        VK.VK_RETURN = 0x0D;    // ENTER
        VK.VK_SHIFT = 0x10;
        VK.VK_CONTROL = 0x11;
        VK.VK_MENU = 0x12;      // ALT
        VK.VK_PAUSE = 0x13;
        VK.VK_CAPITAL = 0x14;   // CAPS LOCK
        VK.VK_ESCAPE = 0x1B;
        VK.VK_SPACE = 0x20;
        VK.VK_PRIOR = 0x21;     // PAGE UP
        VK.VK_NEXT = 0x22;      // PAGE DOWN
        VK.VK_END = 0x23;
        VK.VK_LEFT = 0x25;
        VK.VK_UP = 0x26;
        VK.VK_RIGHT = 0x27;
        VK.VK_DOWN = 0x28;
        VK.VK_PRINT = 0x2A;
        VK.VK_SNAPSHOT = 0x2C;  // PRINT SCREEN
        VK.VK_INSERT = 0x2D;
        VK.VK_DELETE = 0x2E;
        VK.VK_HELP = 0x2F;
        VK.VK_0 = 0x30;
        VK.VK_1 = 0x31;
        VK.VK_2 = 0x32;
        VK.VK_3 = 0x33;
        VK.VK_4 = 0x34;
        VK.VK_5 = 0x35;
        VK.VK_6 = 0x36;
        VK.VK_7 = 0x37;
        VK.VK_8 = 0x38;
        VK.VK_9 = 0x39;
        VK.VK_A = 0x41;
        VK.VK_B = 0x42;
        VK.VK_C = 0x43;
        VK.VK_D = 0x44;
        VK.VK_E = 0x45;
        VK.VK_F = 0x46;
        VK.VK_G = 0x47;
        VK.VK_H = 0x48;
        VK.VK_I = 0x49;
        VK.VK_J = 0x4A;
        VK.VK_K = 0x4B;
        VK.VK_L = 0x4C;
        VK.VK_M = 0x4D;
        VK.VK_N = 0x4E;
        VK.VK_O = 0x4F;
        VK.VK_P = 0x50;
        VK.VK_Q = 0x51;
        VK.VK_R = 0x52;
        VK.VK_S = 0x53;
        VK.VK_T = 0x54;
        VK.VK_U = 0x55;
        VK.VK_V = 0x56;
        VK.VK_W = 0x57;
        VK.VK_X = 0x58;
        VK.VK_Y = 0x59;
        VK.VK_Z = 0x5A;
        VK.VK_LWIN = 0x5B;      // LEFT WIN
        VK.VK_RWIN = 0x5C;      // RIGHT WIN
        VK.VK_SLEEP = 0x5F;
        VK.VK_NUMPAD0 = 0x60;
        VK.VK_NUMPAD1 = 0x61;
        VK.VK_NUMPAD2 = 0x62;
        VK.VK_NUMPAD3 = 0x63;
        VK.VK_NUMPAD4 = 0x64;
        VK.VK_NUMPAD5 = 0x65;
        VK.VK_NUMPAD6 = 0x66;
        VK.VK_NUMPAD7 = 0x67;
        VK.VK_NUMPAD8 = 0x68;
        VK.VK_NUMPAD9 = 0x69;
        VK.VK_MULTIPLY = 0x6A;
        VK.VK_ADD = 0x6B;
        VK.VK_SEPARATOR = 0x6C;
        VK.VK_SUBTRACT = 0x6D;
        VK.VK_DECIMAL = 0x6E;
        VK.VK_DIVIDE = 0x6F;
        VK.VK_F1 = 0x70;
        VK.VK_F2 = 0x71;
        VK.VK_F3 = 0x72;
        VK.VK_F4 = 0x73;
        VK.VK_F5 = 0x74;
        VK.VK_F6 = 0x75;
        VK.VK_F7 = 0x76;
        VK.VK_F8 = 0x77;
        VK.VK_F9 = 0x78;
        VK.VK_F10 = 0x79;
        VK.VK_F11 = 0x7A;
        VK.VK_F12 = 0x7B;
        VK.VK_NUMLOCK = 0x90;
        VK.VK_SCROLL = 0x91;    // SCROLL LOCK
        VK.VK_LSHIFT = 0xA0;
        VK.VK_RSHIFT = 0xA1;
        VK.VK_LCONTROL = 0xA2;
        VK.VK_RCONTROL = 0xA3;
        VK.VK_LMENU = 0xA4;     // Left MENU key
        VK.VK_RMENU = 0xA5;     // Right MENU key
        return VK;
    })();

    Exported.buildNotifier = function () {
        return new Window_JPCNotifier();
    }

    Exported.notify = function (msg, duration = 3000) {
        if (Exported.notifier !== null) {
            if (Exported.notifier.parent !== null && (Exported.notifier.parent instanceof WindowLayer) === true) {
                Exported.notifier.submit(msg, duration);
            }
        }
    }

    Exported.registerKeyBind = function (vkey, keyName) {
        Input.keyMapper[vkey] = keyName;
    }

    Exported.getPluginParams = function (pluginName) {
        return PluginManager.parameters(pluginName);
    }

    Exported.parseNote = function (note, xmlquery) {
        const JPCNote = retrieveJPCSectionFromNote(note);
        return JPCNote ? commitXMLQuery(JPCNote, xmlquery) : null;
    }

    Exported.parseNoteToBoolean = function (note, xmlquery) {
        const result = Exported.parseNote(note, xmlquery) || "false";
        return JSON.parse(result);
    }

    Exported.parseNoteToInt = function (note, xmlquery) {
        const int = Exported.parseNote(note, xmlquery);
        return int === null ? null : parseInt(int);
    }

    Exported.parseNoteToFloat = function (note, xmlquery) {
        const float = Exported.parseNote(note, xmlquery);
        return float === null ? null : parseFloat(float);
    }

    Exported.parseNoteToNumArray = function (note, xmlquery) {
        const numArray = Exported.parseNote(note, xmlquery);
        return JSON.parse(numArray);
    }

    Exported.loadGLSLShaderFile = function (filePath) {
        const path = require("path"), fs = require("fs");
        const shaderFile = fs.readFileSync(path.resolve(filePath));
        return shaderFile;
    }

    function commitXMLQuery(data, query) {
        try {
            var xmldoc = require("js/plugins/third_party/xmldoc.js");
            var xml = new xmldoc.XmlDocument(data);
            return xml.valueWithPath(query);
        } catch (error) {
            return null;
        }
    }

    function retrieveJPCSectionFromNote(note) {
        const pattern = /(<jpc>[\w\s<>\/\?\.\-\[\]\,]+<\/jpc>)/;
        const match = pattern.exec(note);
        return match ? match[0] : null;
    }

    //=============================================================================
    // Window_JPCNotifier
    //=============================================================================

    function Window_JPCNotifier() {
        this.initialize(...arguments);
    }

    Window_JPCNotifier.prototype = Object.create(Window_Base.prototype);

    Window_JPCNotifier.prototype.constructor = Window_JPCNotifier;

    Window_JPCNotifier.prototype.initialize = function () {
        Window_Base.prototype.initialize.call(this, new Rectangle(-10, -20, 0, 0));
        this._working = [];
        this._waiting = [];
        this._maxWorkingQueueSize = 5;
        this._fontsize = 16;
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = this._fontsize;
        this.backOpacity = 0;
        this.opacity = 0; // Disable background frame
        this._duration = 3000; // in milliseconds
        this.contentsOpacity = 0;
        this._isBusy = false;
        this._isWindow = false;
        this.resetTimer();
        this.refresh();
    };

    Window_JPCNotifier.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (this._isBusy) {
            if (this.isExpired() == false) {
                this.contentsOpacity += 8;
                this.refresh();
            } else {
                this.contentsOpacity -= 8;
                if (this.contentsOpacity <= 0) {
                    this.contentsOpacity = 0;
                    this.clearText();
                    if (this._waiting.length > 0) {
                        var maxduration = 0;
                        // Move contents from waiting queue to working queue
                        while (this._waiting.length > 0 && this._working.length < this._maxWorkingQueueSize) {
                            const data = this._waiting.pop();
                            maxduration = Math.max(data.duration, maxduration);
                            this._working.unshift(data.text);
                        }
                        // restart the notification
                        this._duration = maxduration;
                        this.startNotification();
                    } else {
                        this._isBusy = false;
                        this.move(-10, -20, 0, 0);
                    }
                }
            }
        }
    }

    Window_JPCNotifier.prototype.drawTextEx = function (text, x, y, width) {
        this.contents.fontSize = this._fontsize;
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    Window_JPCNotifier.prototype.outputText = function () {
        var output = "";
        this._working.reverse().forEach((text) => {
            output += (text + "\n");
        });
        this._working.reverse();
        return output;
    }

    Window_JPCNotifier.prototype.resetTimer = function () {
        this._start_timestamp = new Date().getTime();
    }

    Window_JPCNotifier.prototype.refresh = function () {
        this.contents.clear();
        this.drawTextEx(this.outputText(), 0, 0, this.innerWidth);
    }

    Window_JPCNotifier.prototype.isExpired = function () {
        const current_timestamp = new Date().getTime();
        return current_timestamp > (this._start_timestamp + this._duration);
    }

    Window_JPCNotifier.prototype.startNotification = function () {
        // We have height range about 5 line in maximum
        this.move(-10, -15, Graphics.boxWidth, Graphics.boxHeight);
        this._isBusy = true;
        this.contentsOpacity = 0;
        this.createContents();
        this.resetTimer();
        this.refresh();
    }

    Window_JPCNotifier.prototype.submit = function (text, duration) {
        if (this._isBusy == false) {
            this.startNotification();
        }
        if (this._working.length >= this._maxWorkingQueueSize) {
            this._waiting.unshift({
                text: text,
                duration: duration
            });
        } else {
            Exported.notifier.resetTimer();
            this._duration = Math.max(this._duration, duration);
            this._working.unshift(text);
        }
    }

    Window_JPCNotifier.prototype.clearText = function () {
        this._working = [];
    }

    Window_JPCNotifier.prototype.isBusy = function () {
        return this._isBusy;
    }

    //=============================================================================
    // Renew Scene_Map
    //=============================================================================
    const _Scene_Map__createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _Scene_Map__createDisplayObjects.apply(this, arguments);
        JPC.notifier = JPC.buildNotifier();
        this.addWindow(JPC.notifier);
    };

    return Exported;
})();

/* MIT License

Copyright (c) 2020 Jim00000

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