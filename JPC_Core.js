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
        const pattern = /(<jpc>[\w\s<>\/\?]+<\/jpc>)/;
        const match = pattern.exec(note);
        return match ? match[0] : null;
    }

    (() => { })();
}