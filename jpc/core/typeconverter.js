export const __typeconverter = {};

__typeconverter.toBoolean = function(objects) {
    if (typeof (objects) === 'boolean') {
        return objects;
    } else if (typeof (objects) === 'string') {
        return JSON.parse(objects.toLowerCase());
    } else if (typeof (objects) === 'object') {
        if (Array.isArray(objects)) {
            for (let i = 0; i < objects.length; i++) {
                objects[i] = __typeconverter.toBoolean(objects[i]);
            }
            return objects;
        }
    }
};

__typeconverter.toNumber = function(objects) {
    if (typeof (objects) === 'number') {
        return objects;
    } else if (typeof (objects) === 'string') {
        return Number(objects);
    } else if (typeof (objects) === 'object') {
        if (Array.isArray(objects)) {
            for (let i = 0; i < objects.length; i++) {
                objects[i] = __typeconverter.toNumber(objects[i]);
            }
            return objects;
        }
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