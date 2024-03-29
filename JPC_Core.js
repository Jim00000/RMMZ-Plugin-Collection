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

/*:
 * @target MZ
 * @plugindesc Essential core file for JPC plugins.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_Core.js
 * @help
 * JPC Plugins - Essential Core - WIP
 *
 * ◼️ Introduction
 *
 * The plugin contains essential functions and modules to support other JPC
 * plugin's functionality. This plugin should be put before other JPC plugins.
 * Some features are provided by this plugin :
 *
 * - Logger (js-logger v1.6.1)
 * - Input mapping and key event binding
 * - A simple notifier
 * - XML parsing
 * - GLSL support and helper
 * - Miscellaneous
 *
 * ◼️ Dependencies
 *
 * No
 *
 * ◼️ Platform compatibility
 *
 * ☑ Windows
 * ☐ macOS (never tested)
 * ☑ Web browsers
 * ☐ Mobile Devices (Android / iOS) (never tested)
 *
 * ◼️ License
 *
 * JPC software is under MIT License. See LICENSE for more information.
 *
 * @ --- Parameters ---
 *
 * @param titleScreenMessageFlag
 * @text Show plugin info
 * @desc Print plugin(s) information in the title scene
 * @type boolean
 * @default false
 * @on Enable
 * @off Disable
 *
 * @param enableLog
 * @text Console log
 * @desc Use logger to track plugin's status. Take performance into account,
 * this option should be disabled while the game is released.
 * @type boolean
 * @default false
 * @on Enable
 * @off Disable
 *
 * @param speed_multiplier
 * @text Game speed
 * @desc Speedup the game with a factor just like the speedhack in Cheat Engine.
 * 1.0x means normal gameplay speed. More larger the multiplier is, more faster
 * the game runs.
 * @type number
 * @default 1.0
 * @decimals 2
 * @min 0.0
 * @max 16.0
 *
 * @ --- Plugin Commands ---
 *
 * @command changeGameSpeed
 * @text Change game speed
 * @desc Change the game speed in the range of [0.5, 5.0].
 *
 * @arg speed
 * @text game speed
 * @type number
 * @default 1.0
 * @min 0.5
 * @max 5.0
 * @decimals 1
 */

const JPC = (() => {
    'use strict'
    let Exported = {};

    //////////////////////////////////////////////
    /////          Imported Modules          /////
    //////////////////////////////////////////////

    Exported.import = {};  // import will place objects/functions from other modules
    Exported.core = {};

    // clang-format off
    // Load all of core submodules
    Exported.import['core_submodules'] = import('./jpc/core/core.js').then(core_module => {
        Exported.core = core_module.__core;
        Exported.core.log.debug('Submodules of JPC core are all ready.');
    }).catch(() => {
        throw new Error("Cannot initialize submodules of JPC core");
    });
    // clang-format on

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

    Exported.getPluginParams = function(pluginName) {
        return PluginManager.parameters(pluginName);
    };

    Exported.getPluginInfo = function(doc) {
        const pluginName = Exported.getPluginName(doc);
        const parameters = Exported.getPluginParams(pluginName);
        return [pluginName, parameters];
    };

    return Exported;
})();

JPC.import['core'] = (async (pluginName, pluginParams) => {
    'use strict';

    // Await core submodules is complete.
    await JPC.import['core_submodules'];
    delete JPC.import['core_submodules'];

    ///////////////////////////////////////////////
    /////               Options               /////
    ///////////////////////////////////////////////

    JPC.core.options = {};
    // Whether show the plugin information on the title screen
    const _outputMsgInTitleScene = JPC.core.type.toBoolean(pluginParams.titleScreenMessageFlag);
    // Speedup the gameplay (like speedhack)
    let speed_multiplier = JPC.core.type.toNumber(pluginParams.speed_multiplier);

    // Handle log level
    if (JPC.core.type.toBoolean(pluginParams.enableLog) === false) {
        JPC.core.log.setLevel(JPC.core.log.OFF);
    }

    ///////////////////////////////////////////////////////
    /////               Plugin Commands               /////
    ///////////////////////////////////////////////////////
    PluginManager.registerCommand(pluginName, 'changeGameSpeed', (args) => {
        speed_multiplier = JPC.core.type.toNumber(args.speed);
        JPC.core.log.debug(`Game speed changes to ${speed_multiplier}`);
    });

    ////////////////////////////////////////////
    /////               Hook               /////
    ////////////////////////////////////////////

    const _Scene_Base__update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base__update.apply(this, arguments);
        Graphics.app.ticker.speed = speed_multiplier;
    };

    if (_outputMsgInTitleScene === true) {
        // make message appear in title scene one time only.
        let _isMsgPrintedInTitleSceneEnd = false;

        const _Scene_Title__start = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function() {
            _Scene_Title__start.apply(this, arguments);
            if (_isMsgPrintedInTitleSceneEnd === false) {
                JPC.core.notifier.notify('Welcome to use Jim00000\'s Plugin Collection (JPC)', 3500);
                JPC.core.notifier.notify('Enabled plugins : ', 7000);
                $plugins.forEach((plugin, index) => {
                    if (plugin.status === true) JPC.core.notifier.notify(`${plugin.name}`, 7000);
                });
                _isMsgPrintedInTitleSceneEnd = true;
            }
        };
    }

    // Loading plugin is complete.
    JPC.core.log.debug(`${pluginName} is ready.`);
})(...JPC.getPluginInfo(document));