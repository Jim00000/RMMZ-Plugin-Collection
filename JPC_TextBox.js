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
 * @plugindesc Textbox input processing (support Windows platform only).
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_TextBox.js
 * @help
 * TextBox Input Window v1.0.0
 *
 * ◼️ Introduction
 *
 * This plugin provides a convenient way to make input text. Especially for
 * the naming the character. This plugin creates a text box window and the
 * user can input any text, message or others as long as Microsoft Input
 * Method Editors (IME) supports on Windows. That means you can input other
 * languages which are non-ASCII charachters such as chinese / japanese /
 * korean words ,etc. In fact, some special unicode signs are supported,
 * too. For example, radioactive sign `☢`, beamed eighth notes `♫` can be
 * input and displays normally.
 *
 * Notice that textbox window is implemented in Windows API. It is a
 * windows-dependent plugin and requires plugin users building their own
 * textbox module in local machine for security reasons.
 *
 * ◼️ Dependencies
 *
 * - JPC_Core.js
 *
 * ◼️ Platform compatibility
 *
 * ☑ Windows
 * ☐ macOS
 * ☐ Web browsers
 * ☐ Mobile Devices (Android / iOS)
 *
 * ◼️ Plugin Commands
 *
 * ▷ open : open the textbox input windows and put that output text to a
 * certain variable id.
 *
 * ▷ openNameInput : open the textbox input windows and the output text
 * becomes selected actor's name.
 *
 * ◼️ Change Log
 *
 * ✻ v1.0.0
 *   ▷ Initial release
 *
 * ◼️ MIT License
 *
 * Copyright (c) 2021 Jim00000
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * @ --- Command ---
 *
 * @command open
 * @text Open
 * @desc Open the input text window.
 *
 * @arg vid
 * @text variable ID
 * @desc The game variable id which the input text is goint to be stored to
 * @type variable
 * @default 0
 *
 * @arg title
 * @text title
 * @desc textbox window title's text
 * @type text
 * @default Input text window
 *
 * @command openNameInput
 * @text Open name input process
 * @desc Open the name input window and set the name to selected actor.
 *
 * @arg title
 * @text title
 * @desc window's title
 * @type text
 * @default What is your name ?
 *
 * @arg actorId
 * @text actor
 * @type actor
 * @default 0
 */

JPC.import['textbox'] = (async (pluginName, pluginParams) => {
    'use strict';

    JPC.textbox = {};
    JPC.textbox.__version = '1.0.0';
    JPC.textbox.open = null;

    // Waiting for JPC core is ready
    await JPC.import['core'];

    ///////////////////////////////////////////////////////
    /////               Plugin Commands               /////
    ///////////////////////////////////////////////////////

    PluginManager.registerCommand(pluginName, 'open', args => {
        if (JPC.textbox.open !== null && args.vid !== 0) {
            const text = JPC.textbox.open(args.title);
            $gameVariables.setValue(args.vid, text);
        }
    });

    PluginManager.registerCommand(pluginName, 'openNameInput', args => {
        if (JPC.textbox.open !== null && args.actorId !== 0) {
            const name = JPC.textbox.open(args.title);
            $gameActors.actor(args.actorId).setName(name);
        }
    });

    /////////////////////////////////////////////////
    /////               Functions               /////
    /////////////////////////////////////////////////

    function initializeTextBox(nodepath) {
        const fs = require('fs');
        if (fs.existsSync(nodepath) === true) {
            JPC.core.log.debug(`Loading ${nodepath}.`);
            const cpp = require(nodepath);
            const openTextBox = ((window_title) => {
                const x = nw.Window.get().x
                const y = nw.Window.get().y
                const w = nw.Window.get().width
                const h = nw.Window.get().height
                const inputtext = cpp.openTextBox(x, y, w, h, window_title);
                return inputtext;
            });
            JPC.textbox.open = openTextBox;
            JPC.core.log.debug('JPC.textbox.open is ready.');
        }
    };

    // Notice that this plugin needs NW.js support
    if (JPC.core.misc.isNwjs() === true) {
        JPC.core.log.debug('Client\'s environment support NW.js.');
        if (process.platform === 'win32') {
            JPC.core.log.debug('Client\'s OS is Windows.');
            const fs = require('fs'), path = require('path');
            const addons_path = path.join('js', 'plugins', 'jpc', 'native', 'addons', 'textbox.node');
            const debug_path = path.join('js', 'plugins', 'jpc', 'native', 'textbox', 'build', 'Debug', 'textbox.node');
            const release_path =
                path.join('js', 'plugins', 'jpc', 'native', 'textbox', 'build', 'Release', 'textbox.node');
            if (fs.existsSync(addons_path) === true) {
                JPC.core.log.debug(`${addons_path} is found.`);
                initializeTextBox(addons_path);
            } else if (fs.existsSync(release_path) === true) {
                JPC.core.log.debug(`${release_path} is found.`);
                initializeTextBox(release_path);
            } else if (fs.existsSync(debug_path) === true) {
                JPC.core.log.debug(`${debug_path} is found.`);
                initializeTextBox(debug_path);
            } else {
                Graphics.printError('textbox.node cannot be found', `Make sure textbox addon is built.`);
                JPC.core.log.error('textbox.node is missing.');
            }
        } else {
            Graphics.printError('Unsupported OS detected', 'This plugin only supports Windows platform');
            JPC.core.log.error(`Client's OS is unsupported. ${pluginName} cannot activate.`);
        }
    } else {
        Graphics.printError('NW.js is unsupported', `${pluginName} needs NW.js supported`);
        JPC.core.log.error('NW.js is unsupported');
    }

    // Loading plugin is complete.
    JPC.core.log.debug(`${pluginName} is ready.`);
})(...JPC.getPluginInfo(document));