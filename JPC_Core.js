/*:
 * @target MZ
 * @plugindesc Essential core file for JPC plugins.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_Core.js
 * @help
 * The plugin contains essential functions and modules to support other JPC's
 * plugins.
 */

const JPC = (() => {
    'use strict'
    let Exported = {};

    //////////////////////////////////////////////
    /////          Imported Modules          /////
    //////////////////////////////////////////////

    Exported.import = {};  // import will place objects/functions from other modules
    Exported.core = {};

    Exported.import['core_vkeys'] = import('./jpc/core/vkeys.js').then(mod => {
        Exported.core.vkeys = mod.__vkeys;
    });

    Exported.import['core_notifier'] = import('./jpc/core/notifier.js').then(mod => {
        Exported.notifier = mod.__notifier;
    });

    Exported.import['core_miscellany'] = import('./jpc/core/miscellany.js').then(mod => {
        Exported.core.misc = mod.__miscellany;
    });

    ///////////////////////////////////////////////////////////////////
    /////               Public Synchronized Methods               /////
    ///////////////////////////////////////////////////////////////////

    Exported.parseJSFileName = function(doc) {
        const path = doc.currentScript.src;
        const filenameWithExtension = path.substring(path.lastIndexOf('/') + 1);
        const filename = filenameWithExtension.substring(0, filenameWithExtension.length - 3); // remove file extension (.js)
        return filename;
    };

    Exported.getPluginParams = function(doc) {
        const pluginName = Exported.parseJSFileName(doc);
        return PluginManager.parameters(pluginName);
    };

    Exported.loadGLSLShaderFile = function(filePath) {
        return readFileAsString(filePath);
    };

    Exported.createFilter = function(shaderPath, uniforms = {}) {
        // Here we use OpenGL ES 3.0
        const vertSrc = Exported.loadGLSLShaderFile('js/plugins/shaders/default.vs');
        const fragSrc = Exported.loadGLSLShaderFile(shaderPath);
        const filter = new PIXI.Filter(vertSrc, fragSrc, uniforms);
        return filter;
    };

    Exported.select = function(...args) {
        for (const arg of args) {
            if (arg !== undefined && arg !== null) {
                return arg;
            }
        }
        return null;
    };

    //=============================================================================
    // Private functions
    //=============================================================================

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
        let request = new XMLHttpRequest();
        // Note that synchronous XMLHttpRequest is deprecated.
        // TODO: any better approaches ?
        request.open('GET', path, false);
        request.send();
        if (request.status === 200) {
            return request.responseText;
        } else {
            return null;
        }
    };

    ////////////////////////////////////////////
    /////               Hook               /////
    ////////////////////////////////////////////
    const _Scene_Map__createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map__createDisplayObjects.apply(this, arguments);
        JPC.notifier.instance = JPC.notifier.build();
        this.addWindow(JPC.notifier.instance);
    };

    return Exported;
})();

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