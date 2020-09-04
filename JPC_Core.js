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