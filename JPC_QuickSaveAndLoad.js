//=============================================================================
// RPG Maker MZ - Quick Save/Load
//=============================================================================

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
(() => {
    'use strict';

    const PLUGIN_NAME = "jpc_quicksaveandload";
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    const QUICK_SAVE_KEY_STRING = "QuickSave";
    const QUICK_LOAD_KEY_STRING = "QuickLoad";
    const QUICK_SAVE_FILENAME = PLUGINPARAMS['quick_save_name'];
    const QUICK_SAVE_KEY = PLUGINPARAMS['quick_save_key'];
    const QUICK_LOAD_KEY = PLUGINPARAMS['quick_load_key'];

    // Register F6 as quicksave hotkey
    JPC.registerKeyBind(QUICK_SAVE_KEY, QUICK_SAVE_KEY_STRING);
    // Register F7 as quickload hotkey
    JPC.registerKeyBind(QUICK_LOAD_KEY, QUICK_LOAD_KEY_STRING);

    function makeQuickSaveName() {
        return QUICK_SAVE_FILENAME;
    }

    function loadGameFromQuickSave() {
        const quickSaveName = makeQuickSaveName();
        return StorageManager.loadObject(quickSaveName).then(contents => {
            DataManager.createGameObjects();
            DataManager.extractSaveContents(contents);
            DataManager.correctDataErrors();
            return 0;
        });
    }

    function doQuickSave() {
        const contents = DataManager.makeSaveContents();
        const saveName = makeQuickSaveName();
        return StorageManager.saveObject(saveName, contents);
    }

    function quickSave() {
        doQuickSave()
            .then(() => { SoundManager.playSave(); })
            .catch(() => { SoundManager.playBuzzer(); });
    }

    function quickLoad() {
        loadGameFromQuickSave()
            .then(() => {
                SoundManager.playLoad();
                SceneManager.goto(Scene_Map);
            })
            .catch(() => { SoundManager.playBuzzer(); });
    }

    function updateCallQuickSave() {
        if (isQuickSaveCalled()) {
            quickSave();
            JPC.notify("Quick save is done");
        }
    }

    function updateCallQuickLoad() {
        if (isQuickLoadCalled()) {
            quickLoad();
            setTimeout(() => {
                JPC.notify("Quick load is done");
            }, 600);
        }
    }

    function isQuickSaveCalled() {
        return Input.isTriggered(QUICK_SAVE_KEY_STRING);
    }

    function isQuickLoadCalled() {
        return Input.isTriggered(QUICK_LOAD_KEY_STRING);
    }

    const _Scene_Map__updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function () {
        _Scene_Map__updateScene.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            updateCallQuickSave();
        }
        if (!SceneManager.isSceneChanging()) {
            updateCallQuickLoad();
        }
    };

    const _Scene_Title__update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function () {
        _Scene_Title__update.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            updateCallQuickLoad();
        }
    };

})();

/* MIT License

Copyright (c) 2020 Jim00000

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