/*:
 * @target MZ
 * @plugindesc Input text box (Support Windows platform only.)
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_TextBox.js
 * @help
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
 */

(async (pluginName, pluginParams) => {
    'use strict';

    JPC.textbox = {};
    JPC.textbox.__version = 'wip';
    JPC.textbox.open = null;

    ///////////////////////////////////////////////////////
    /////               Plugin Commands               /////
    ///////////////////////////////////////////////////////

    PluginManager.registerCommand(pluginName, 'open', args => {
        if(JPC.textbox.open !== null && args.vid !== 0) {
            const text = JPC.textbox.open(args.title);
            $gameVariables.setValue(args.vid, text);
        }
    });

    /////////////////////////////////////////////////
    /////               Functions               /////
    /////////////////////////////////////////////////

    function initializeTextBox(nodepath) {
        const fs = require('fs');
        if (fs.existsSync(nodepath) === true) {
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
        }
    };

    // Notice that this plugin needs NW.js support
    if (Utils.isNwjs() === true) {
        const fs = require('fs'), path = require('path');
        const textbox_path = path.join('js', 'plugins', 'jpc', 'native', 'textbox');
        const build_path = path.join(textbox_path, 'build');
        if (fs.existsSync(build_path) === true) {
            if (fs.existsSync(path.join(build_path, 'Release')) === true) {
                if (fs.existsSync(path.join(build_path, 'Release', 'textbox.node')) === true) {
                    const nodepath = path.join(build_path, 'Release', 'textbox.node');
                    initializeTextBox(nodepath);
                }
            } else if (fs.existsSync(path.join(build_path, 'Debug')) === true) {
                if (fs.existsSync(path.join(build_path, 'Debug', 'textbox.node')) === true) {
                    const nodepath = path.join(build_path, 'Debug', 'textbox.node');
                    initializeTextBox(nodepath);
                }
            } else {
                Graphics.printError('textbox.node cannot be found', `You should build textbox native node.`);
            }
        }
    } else {
        Graphics.printError('NW.js is unsupported', `${pluginName} needs NW.js supported`);
    }

})(JPC.getPluginName(document), JPC.getPluginParams(document));

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

*/