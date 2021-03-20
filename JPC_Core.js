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

    // js-logger v1.6.1
    Exported.import['core_logger'] = import('./jpc/core/third_party/logger.js').then(mod => {
        Exported.core.logger = mod.__logger;
        Exported.core.logger.useDefaults({formatter: jpc_logger_formatter});
        Exported.core.logger.setLevel(Exported.core.logger.DEBUG);
        Exported.core.logger.debug('JPC.core.logger is ready.');
    });

    Exported.import['core_vkeys'] = import('./jpc/core/vkeys.js').then(mod => {
        Exported.core.vkeys = mod.__vkeys;
        Exported.import['core_logger'].then(() => {
            Exported.core.logger.debug('JPC.core.vkeys is ready.');
        });
    });

    Exported.import['core_notifier'] = import('./jpc/core/notifier.js').then(mod => {
        Exported.notifier = mod.__notifier;
        Exported.import['core_logger'].then(() => {
            Exported.core.logger.debug('JPC.notifier is ready.');
        });
    });

    Exported.import['core_typeconverter'] = import('./jpc/core/typeconverter.js').then(mod => {
        Exported.core.typeconverter = mod.__typeconverter;
        Exported.import['core_logger'].then(() => {
            Exported.core.logger.debug('JPC.core.typeconverter is ready.');
        });
    });

    Exported.import['core_xmlparser'] = import('./jpc/core/xmlparser.js').then(mod => {
        Exported.core.xmlparser = mod.__xmlparser;
        Exported.import['core_logger'].then(() => {
            Exported.core.logger.debug('JPC.core.xmlparser is ready.');
        });
    });

    Exported.import['core_glsl'] = import('./jpc/core/glsl.js').then(mod => {
        Exported.core.glsl = mod.__glsl;
        Exported.import['core_logger'].then(() => {
            Exported.core.logger.debug('JPC.core.glsl is ready.');
        });
    });

    Exported.import['core_miscellany'] = import('./jpc/core/miscellany.js').then(mod => {
        Exported.core.misc = mod.__miscellany;
        Exported.import['core_logger'].then(() => {
            Exported.core.logger.debug('JPC.core.misc is ready.');
        });
    });

    ///////////////////////////////////////////////
    /////               Options               /////
    ///////////////////////////////////////////////

    Exported.core.options = {};
    // Whether show the plugin information on the title screen
    Exported.core.options.outputMsgInTitleScene = true;
    // Speedup the gameplay (like speedhack)
    Exported.core.options.speed_multiplier = 1;

    // make message appear in title scene one time only.
    let _isMsgPrintedInTitleSceneEnd = false;

    ////////////////////////////////////////////////////////
    /////               Logger Formatter               /////
    ////////////////////////////////////////////////////////

    function jpc_logger_formatter(messages, context) {
        const date = new Date();
        messages.unshift(`[${context.level.name}][${date.toLocaleDateString()} ${date.toLocaleTimeString()}.${
            date.getMilliseconds()}]`);
    };

    //////////////////////////////////////////////////////
    /////               Public Methods               /////
    //////////////////////////////////////////////////////

    Exported.parseJSFileName = function(doc) {
        const path = doc.currentScript.src;
        const filenameWithExtension = path.substring(path.lastIndexOf('/') + 1);
        const filename =
            filenameWithExtension.substring(0, filenameWithExtension.length - 3);  // remove file extension (.js)
        return filename;
    };

    Exported.getPluginName = function(doc) {
        const pluginName = Exported.parseJSFileName(doc);
        return pluginName;
    };

    Exported.getPluginParams = function(doc) {
        const pluginName = Exported.getPluginName(doc);
        return PluginManager.parameters(pluginName);
    };

    ////////////////////////////////////////////
    /////               Hook               /////
    ////////////////////////////////////////////

    const _Scene_Base__update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base__update.apply(this, arguments);
        Graphics.app.ticker.speed = JPC.core.options.speed_multiplier;
    };

    const _Scene_Title__start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title__start.apply(this, arguments);
        if (JPC.core.options.outputMsgInTitleScene && _isMsgPrintedInTitleSceneEnd === false) {
            JPC.notifier.notify('Welcome to use Jim00000\'s Plugin Collection (JPC)', 3500);
            JPC.notifier.notify('Enabled plugins : ', 7000);
            $plugins.forEach((plugin, index) => {
                if (plugin.status === true) JPC.notifier.notify(`${plugin.name}`, 7000);
            });
            _isMsgPrintedInTitleSceneEnd = true;
        }
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