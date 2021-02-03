/*:
 * @target MZ
 * @plugindesc A simple, skyrim style like quick save and quick load system.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_QuickSaveAndLoad.js
 * @base JPC_Core
 * @help
 * ◼️ Introduction
 * 
 * A simple quicksave mechanism similar to The Elder Scrolls V: Skyrim. Use 
 * F6 to quicksave and then F7 to quickload in default. You can quick save in 
 * the game map scene and quick load in game map scene or game title scene. 
 * The quick save file is named as "quicksave.rmmzsave" in default.
 *
 * ◼️ Dependencies
 * 
 * - JPC_Core.js
 * 
 * ◼️ MIT License
 * 
 * Copyright (c) Jim00000
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
 * @param quick_save_name
 * @text Save file name
 * @desc The file name of quick save
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

    JPC.import['core_miscellany'].then(() => {
        // Register F6 as quicksave hotkey
        JPC.core.misc.registerKeyBinding(pluginParams.quick_save_key, 'QuickSave');
        // Register F7 as quickload hotkey
        JPC.core.misc.registerKeyBinding(pluginParams.quick_load_key, 'QuickLoad');
    });

    class QuickSaveLoad {
        static getQuickSavefileName() {
            return pluginParams.quick_save_name;
        }

        static getQuickSavefileId() {
            return DataManager.maxSavefiles() + 1;
        }

        static save() {
            const quickSavefileId = QuickSaveLoad.getQuickSavefileId();
            const saveName = QuickSaveLoad.getQuickSavefileName();
            $gameSystem._versionId = $dataSystem.versionId;
            $gameSystem._framesOnSave = Graphics.frameCount;
            $gameSystem._bgmOnSave = AudioManager.saveBgm();
            $gameSystem._bgsOnSave = AudioManager.saveBgs();
            const contents = DataManager.makeSaveContents();
            StorageManager.saveObject(saveName, contents)
                .then(() => {
                    DataManager._globalInfo[quickSavefileId] = DataManager.makeSavefileInfo();
                    DataManager.saveGlobalInfo();
                })
                .then(() => SoundManager.playSave())
                .catch(() => SoundManager.playBuzzer())
                .then(() => JPC.notifier.notify(pluginParams.quick_save_notification_msg));
        }

        static load() {
            const saveName = QuickSaveLoad.getQuickSavefileName();
            StorageManager.loadObject(saveName)
                .then(contents => {
                    DataManager.createGameObjects();
                    DataManager.extractSaveContents(contents);
                    DataManager.correctDataErrors();
                })
                .then(() => {
                    SoundManager.playLoad();
                    QuickSaveLoad.fadeInOut();
                    SceneManager.goto(Scene_Map);
                    Scene_Load.prototype.reloadMapIfUpdated();
                    JPC.notifier.notify(pluginParams.quick_load_notification_msg);
                })
                .catch(() => {
                    SoundManager.playBuzzer();
                });
        }

        static fadeInOut() {
            const time = Scene_Load.prototype.slowFadeSpeed() / 60;
            AudioManager.fadeOutBgm(time);
            AudioManager.fadeOutBgs(time);
            AudioManager.fadeOutMe(time);
            $gameScreen.startFadeOut(Scene_Load.prototype.slowFadeSpeed());
            $gameScreen.startFadeIn(Scene_Load.prototype.slowFadeSpeed());
        }

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
            return Input.isTriggered('QuickSave');
        };

        static isQuickLoadCalled() {
            return Input.isTriggered('QuickLoad');
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