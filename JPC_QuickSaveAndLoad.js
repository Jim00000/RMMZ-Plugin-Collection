/*:
 * @target MZ
 * @plugindesc Quick save/load mechanism.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_QuickSaveAndLoad.js
 * @base JPC_Core
 * @help
 * Use F6 to quicksave, F7 to quickload in default.
 * The quick save file is named as "quicksave.rmmzsave" in default.
 * You can also quick load the save file in the game title scene.
 *
 * @param quick_save_name
 * @text filename
 * @desc The filename of quick save
 * @type string
 * @default quicksave
 *
 * @param quick_save_notification_msg
 * @text Quick save text
 * @desc The notification text while quicksaving is done.
 * @type string
 * @default Quicksaving...
 *
 * @param quick_load_notification_msg
 * @text Quick load text
 * @desc The notification text while quickloading is done.
 * @type string
 * @default Quickloading...
 *
 * @param quick_save_key
 * @text quick save key
 * @desc The key to quick save. Input should be a virtual key.
 * @type number
 * @default 117
 *
 * @param quick_load_key
 * @text quick load key
 * @desc The key to quick load. Input should be a virtual key.
 * @type number
 * @default 118
 */

(async (pluginParams) => {
    'use strict';

    const QUICK_SAVE_KEY_STRING = 'QuickSave';
    const QUICK_LOAD_KEY_STRING = 'QuickLoad';
    const QUICK_SAVE_FILENAME = pluginParams.quick_save_name;
    const QUICK_SAVE_KEY = pluginParams.quick_save_key;
    const QUICK_LOAD_KEY = pluginParams.quick_load_key;
    const QUICK_SAVE_NOTIFICATION_MESSAGE = pluginParams.quick_save_notification_msg;
    const QUICK_LOAD_NOTIFICATION_MESSAGE = pluginParams.quick_load_notification_msg;

    JPC.import['core_miscellany'].then(() => {
        // Register F6 as quicksave hotkey
        JPC.core.misc.registerKeyBinding(QUICK_SAVE_KEY, QUICK_SAVE_KEY_STRING);
        // Register F7 as quickload hotkey
        JPC.core.misc.registerKeyBinding(QUICK_LOAD_KEY, QUICK_LOAD_KEY_STRING);
    });

    class QuickSaveLoad {
        static async save() {
            const contents = DataManager.makeSaveContents();
            try {
                JPC.notifier.notify(QUICK_SAVE_NOTIFICATION_MESSAGE);
                await StorageManager.saveObject(QUICK_SAVE_FILENAME, contents);
                SoundManager.playSave();
            } catch (err) {
                SoundManager.playBuzzer();
            }
        };

        static async load() {
            try {
                let contents = StorageManager.loadObject(QUICK_SAVE_FILENAME);
                DataManager.createGameObjects();
                DataManager.extractSaveContents(await contents);
                DataManager.correctDataErrors();
                SoundManager.playLoad();
                // SceneManager.goto(Scene_Map);

                new Promise((resolve, reject) => {
                    SceneManager.goto(Scene_Map);
                    while (Scene_Map.prototype.isFading() === true) {
                    }
                    resolve(true);
                }).then((success) => {
                    JPC.notifier.notify(QUICK_LOAD_NOTIFICATION_MESSAGE);
                });
            } catch (err) {
                SoundManager.playBuzzer();
            }
        };

        static updateCallQuickSave() {
            if (QuickSaveLoad.isQuickSaveCalled()) {
                QuickSaveLoad.save();
            }
        };

        static updateCallQuickLoad() {
            if (QuickSaveLoad.isQuickLoadCalled()) {
                QuickSaveLoad.load();
            }
        };

        static isQuickSaveCalled() {
            return Input.isTriggered(QUICK_SAVE_KEY_STRING);
        };

        static isQuickLoadCalled() {
            return Input.isTriggered(QUICK_LOAD_KEY_STRING);
        };
    };

    ////////////////////////////////////////////
    /////               Hook               /////
    ////////////////////////////////////////////
    const _Scene_Map__updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        _Scene_Map__updateScene.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            QuickSaveLoad.updateCallQuickSave();
        }
        if (!SceneManager.isSceneChanging()) {
            QuickSaveLoad.updateCallQuickLoad();
        }
    };

    const _Scene_Title__update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title__update.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            QuickSaveLoad.updateCallQuickLoad();
        }
    };
})(JPC.getPluginParams(document));

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