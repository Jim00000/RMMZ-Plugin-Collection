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

export const __typeconverter = {};
import * as __misc from './miscellany.js';

const misc = __misc.__miscellany;

class GenericValue {
    #_string
    #_valid

    constructor(string) {
        this.#_string = string;
        this.#_valid = (string !== null && typeof (string) === 'string');
    };

    get string() {
        if (this.valid)
            return this.#_string;
        else
            return null;
    };

    get boolean() {
        if (this.valid)
            return __typeconverter.toBoolean(this.string);
        else
            return null;
    };

    get number() {
        if (this.valid)
            return __typeconverter.toNumber(this.string);
        else
            return null;
    };

    get valid() {
        return this.#_valid;
    };
};

class InvalidValue extends GenericValue {
    constructor() {
        super(null);
    };
};

/**
 * Convert to boolean data type.
 * @param {(boolean|number|string|any[])} objects
 * @returns {(boolean|any[])} boolean value
 * @example
 * toBoolean("true") // return true
 * toBoolean("false") // return false
 * toBoolean("unknown") // return null
 * toBoolean(1) // return true
 * toBoolean(0) // return false
 * toBoolean(["true", ["false"]]) // return [true, [false]]
 */
__typeconverter.toBoolean = function(objects) {
    misc.assert(objects !== undefined, `param 'objects' is undefined`);
    const type = typeof objects;
    switch (type) {
        case 'boolean':
            return objects;
        case 'number':
            switch (objects) {
                case 0:
                    return false;
                case 1:
                    return true;
                default:
                    return null;
            }
        case 'string':
            const string = objects.toLowerCase();
            switch (string) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return null;
            }
        case 'object':
            if (objects === null)
                return objects;
            else if (Array.isArray(objects)) {
                const copy = objects.slice(0);  // clone array
                for (let i = 0; i < copy.length; i++) copy[i] = this.toBoolean(copy[i]);
                return copy;
            }
        default:
            throw new TypeError(`Unsupported type detected. Type '${type}' cannot be transformed to Number type.`);
    }
};

/**
 * Convert to number
 * @param {(boolean|number|string|any[])} objects
 * @returns {(number|any[])} number value
 */
__typeconverter.toNumber = function(objects) {
    misc.assert(objects !== undefined, `param 'objects' is undefined`);
    const type = typeof objects;
    switch (type) {
        case 'boolean':
            if (objects === true)
                return 1;
            else
                return 0;
        case 'number':
            return objects;
        case 'string':
            const num = Number(objects);
            return Number.isNaN(num) ? null : num;
        case 'object':
            if (objects === null)
                return objects;
            else if (Array.isArray(objects)) {
                const copy = objects.slice(0);  // clone array
                for (let i = 0; i < copy.length; i++) copy[i] = this.toNumber(copy[i]);
                return copy;
            }
        default:
            throw new TypeError(`Unsupported type detected. Type '${type}' cannot be transformed to Number type.`);
    }
};

/**
 * Convert to String
 * @param {(boolean|number|string|any[])} objects
 * @returns {(string|any[])} string
 */
__typeconverter.toString = function(objects) {
    misc.assert(objects !== undefined, `param 'objects' is undefined`);
    const type = typeof objects;
    switch (type) {
        case 'undefined':
            throw new TypeError(`Argument 'objects' is undefined. Make sure you pass a valid argument.`);
        case 'boolean':
        case 'number':
        case 'string':
            return objects.toString();
        case 'object':
            if (objects === null)
                return objects;
            else if (Array.isArray(objects)) {
                const copy = objects.slice(0);  // clone array
                for (let i = 0; i < copy.length; i++) copy[i] = this.toString(copy[i]);
                return copy;
            }
        default:
            throw new TypeError(`Unsupported type detected. Type '${type}' cannot be transformed to String type.`);
    }
};

__typeconverter.stringToGeneric = function(string) {
    if (typeof (string) === 'string')
        return new GenericValue(string);
    else
        return new InvalidValue();
};