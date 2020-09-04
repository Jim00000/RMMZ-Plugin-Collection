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

    (() => { })();
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