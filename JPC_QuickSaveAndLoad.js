//=============================================================================
// RPG Maker MZ - Quick Save/Load
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Quick save/load mechanism.
 * @author Jim00000
 * @help 
 * Dependent Files: JPC_Core.js
 * 
 * Use F6 to quicksave, F7 to quickload. The quick save file is named as 
 * "quicksave.rmmzsave". You can also quick load the game save in the game title 
 * scene.
 * 
 */
(() => {
    'use strict';

    const PLUGIN_NAME = "jpc_quicksaveandload";
    const QUICK_SAVE_KEY_STRING = "QuickSave";
    const QUICK_LOAD_KEY_STRING = "QuickLoad";
    const QUICK_SAVE_FILENAME = "quicksave";
    const VK_F6 = 0x75;
    const VK_F7 = 0x76;

    // Register F6 as quicksave hotkey
    JPC.registerKeyBind(VK_F6, QUICK_SAVE_KEY_STRING);
    // Register F7 as quickload hotkey
    JPC.registerKeyBind(VK_F7, QUICK_LOAD_KEY_STRING);

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
            if (JPC.notifier !== null) {
                JPC.notifier.setText("Quick save is done");
                JPC.notifier.open();
            }
        }
    }

    function updateCallQuickLoad() {
        if (isQuickLoadCalled()) {
            quickLoad();
            setTimeout(() => {
                if (JPC.notifier !== null) {
                    JPC.notifier.setText("Quick load is done");
                    JPC.notifier.open();
                }
            }, 1000);
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