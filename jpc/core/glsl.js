export const __glsl = {};

__glsl.createFilter = function(shaderPath, uniforms = {}) {
    // Here we use OpenGL ES 3.0
    const vertSrc = loadGLSLShaderFile('js/plugins/jpc/shaders/default.vs');
    const fragSrc = loadGLSLShaderFile(shaderPath);
    const filter = new PIXI.Filter(vertSrc, fragSrc, uniforms);
    return filter;
};

function loadGLSLShaderFile(filePath) {
    return readFileAsString(filePath);
};

function readFileAsString(filePath) {
    if (Utils.isNwjs() === true) {
        const path = require('path'), fs = require('fs');
        const shaderFile = fs.readFileSync(path.resolve(filePath));
        return shaderFile.toString();
    } else {
        return loadBySyncXHR(filePath);
    }
};

function loadBySyncXHR(path) {
    const request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send();
    if (request.status === 200) {
        return request.responseText;
    } else {
        return null;
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