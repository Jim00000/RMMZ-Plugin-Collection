export const __xmlparser = {};

__xmlparser.parse = function(text) {
    const parser = new DOMParser();
    const xmldoc = parser.parseFromString(text, "text/xml");
    return xmldoc;
}

class XMLDocument {
    #_xmlDoc

    constructor(text) {
        this.#_xmlDoc = JPC.core.xmlparser.parse(text);
    };

    get doc() {
        return this.#_xmlDoc;
    };
};

__xmlparser.XMLDocument = XMLDocument;

XMLDocument.prototype.query = function(...tags) {
    const stringToGeneric = JPC.core.typeconverter.stringToGeneric;
    if (this.doc !== undefined && this.doc !== null) {
        let node = this.doc;
        for (const tag of tags) {
            node = node.getElementsByTagName(tag).item(0);
            if (node === null) return stringToGeneric(null);
        };
        return stringToGeneric(node.textContent);
    } else {
        return stringToGeneric(null);
    }
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