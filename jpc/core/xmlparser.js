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

export const __xmlparser = {};
import * as __type from './typeconverter.js';

__xmlparser.parse = function(text) {
    const jpcxml = __xmlparser.filter(text);
    const parser = new DOMParser();
    const xmldoc = parser.parseFromString(jpcxml, 'text/xml');
    return xmldoc;
};

__xmlparser.filter = function(text) {
    const re = /(^<jpc>[\w\s\<\>\_\/\.]*?<\/jpc>$)/m;
    const match = re.exec(text);
    return match ? match[1] : text;
};

class XMLDocument {
    #_xmlDoc

    constructor(text) {
        this.#_xmlDoc = __xmlparser.parse(text);
    };

    get doc() {
        return this.#_xmlDoc;
    };
};

XMLDocument.prototype.query = function(...tags) {
    const stringToGeneric = __type.__typeconverter.stringToGeneric;
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

__xmlparser.XMLDocument = XMLDocument;