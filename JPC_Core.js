//=============================================================================
// RPG Maker MZ - JPC Core
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Essential core file for JPC plugin.
 * @author Jim00000
 * @help 
 * 
 */

var JPCNotifier = null;

//=============================================================================
// Public Functions
//=============================================================================

function JPC_RegisterKeyBind(vkey, keyName) {
    Input.keyMapper[vkey] = keyName;
}

function JPC_GetPluginParams(pluginName) {
    return PluginManager.parameters(pluginName);
}

function JPC_ParseNote(note, xmlquery) {
    const JPCNote = RetrieveJPCSectionFromNote(note);
    return JPCNote ? CommitXMLQuery(JPCNote, xmlquery) : null;
}

function JPC_ParseNoteToBoolean(note, xmlquery) {
    const result = JPC_ParseNote(note, xmlquery) || "false";
    return JSON.parse(result);
}

function JPC_ParseNoteToInt(note, xmlquery) {
    const int = JPC_ParseNote(note, xmlquery);
    return int === null ? null : parseInt(int);
}

function JPC_ParseNoteToFloat(note, xmlquery) {
    const float = JPC_ParseNote(note, xmlquery);
    return float === null ? null : parseFloat(float);
}

function JPC_ParseNoteToNumArray(note, xmlquery) {
    const numArray = JPC_ParseNote(note, xmlquery);
    return JSON.parse(numArray);
}

{
    //=============================================================================
    // Functions
    //=============================================================================

    function CommitXMLQuery(data, query) {
        try {
            var xmldoc = require("js/plugins/third_party/xmldoc.js");
            var xml = new xmldoc.XmlDocument(data);
            return xml.valueWithPath(query);
        } catch (error) {
            return null;
        }
    }

    function RetrieveJPCSectionFromNote(note) {
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
        Window_Base.prototype.initialize.call(this, new Rectangle(-10, -20, Graphics.boxWidth, Window_Base.prototype.fittingHeight(1)));
        this.move(-10, -20, 0, Window_Base.prototype.fittingHeight(1));
        this._text = "";
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 16;
        this.backOpacity = 0;
        this.opacity = 0; // Disable background frame
        this._duration = 3000; // in milliseconds
        this.contentsOpacity = 0;
        this._start_timestamp = new Date().getTime();
        this._isBusy = false;
        this.refresh();
    };

    Window_JPCNotifier.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (this._isBusy) {
            if (this.isExpired() == false) {
                this.contentsOpacity += 8;
            } else {
                this.contentsOpacity -= 8;
                if (this.contentsOpacity <= 0) {
                    this.contentsOpacity = 0;
                    this._isBusy = false;
                    this.clearText();
                    this.move(-10, -20, 0, Window_Base.prototype.fittingHeight(1));
                }
            }
        }
    }

    Window_JPCNotifier.prototype.open = function () {
        Window_Base.prototype.open.call(this);
        this.move(-10, -20, Graphics.boxWidth, Window_Base.prototype.fittingHeight(1));
        this._isBusy = true;
        this.contentsOpacity = 0;
        this._start_timestamp = new Date().getTime();
        this.refresh();
    }

    Window_JPCNotifier.prototype.refresh = function () {
        this.contents.clear();
        this.drawText(this._text, 0, 0, this.innerWidth, "left");
    }

    Window_JPCNotifier.prototype.isExpired = function () {
        const current_timestamp = new Date().getTime();
        return current_timestamp > (this._start_timestamp + this._duration);
    }

    Window_JPCNotifier.prototype.setText = function (text) {
        this._text = text;
    }

    Window_JPCNotifier.prototype.clearText = function () {
        this._text = "";
    }

    Window_JPCNotifier.prototype.isBusy = function () {
        return this._isBusy;
    }

    //=============================================================================
    // Renew Scene_Map
    //=============================================================================
    const _Scene_Map__createMenuButton = Scene_Map.prototype.createMenuButton;
    Scene_Map.prototype.createMenuButton = function () {
        _Scene_Map__createMenuButton.apply(this, arguments);
        JPCNotifier = new Window_JPCNotifier();
        this.addWindow(JPCNotifier);
    };
}

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