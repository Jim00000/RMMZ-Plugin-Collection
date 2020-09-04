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
{
    //=============================================================================
    // Fixed Parameters
    //=============================================================================
    const PLUGIN_NAME = "jpc_quicksaveandload";
    const QUICK_SAVE_KEY_STRING = "QuickSave";
    const QUICK_LOAD_KEY_STRING = "QuickLoad";
    const QUICK_SAVE_FILENAME = "quicksave";
    const VK_F6 = 0x75;
    const VK_F7 = 0x76;
    
    //=============================================================================
    // Quick Save & Load
    //=============================================================================

    function MakeQuickSaveName() {
        return QUICK_SAVE_FILENAME;
    }

    function LoadGameFromQuickSave() {
        const quickSaveName = MakeQuickSaveName();
        return StorageManager.loadObject(quickSaveName).then(contents => {
            DataManager.createGameObjects();
            DataManager.extractSaveContents(contents);
            DataManager.correctDataErrors();
            return 0;
        });
    }

    function DoQuickSave() {
        const contents = DataManager.makeSaveContents();
        const saveName = MakeQuickSaveName();
        return StorageManager.saveObject(saveName, contents);
    }

    function QuickSave() {
        DoQuickSave()
            .then(() => { SoundManager.playSave(); })
            .catch(() => { SoundManager.playBuzzer(); });
    }

    function QuickLoad() {
        LoadGameFromQuickSave()
            .then(() => {
                SoundManager.playLoad();
                SceneManager.goto(Scene_Map);
            })
            .catch(() => { SoundManager.playBuzzer(); });
    }

    function UpdateCallQuickSave() {
        if (IsQuickSaveCalled()) {
            QuickSave();
        }
    }

    function UpdateCallQuickLoad() {
        if (IsQuickLoadCalled()) {
            QuickLoad();
        }
    }

    function IsQuickSaveCalled() {
        return Input.isTriggered(QUICK_SAVE_KEY_STRING);
    }

    function IsQuickLoadCalled() {
        return Input.isTriggered(QUICK_LOAD_KEY_STRING);
    }

    //=============================================================================
    // Renew Spriteset_Map
    //=============================================================================
    const _Scene_Map__updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function () {
        _Scene_Map__updateScene.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            UpdateCallQuickSave();
        }
        if (!SceneManager.isSceneChanging()) {
            UpdateCallQuickLoad();
        }
    };

    //=============================================================================
    // Renew Scene_Title
    //=============================================================================
    const _Scene_Title__update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function () {
        _Scene_Title__update.apply(this, arguments);
        if (!SceneManager.isSceneChanging()) {
            UpdateCallQuickLoad();
        }
    };
    

    (() => {
        // Register F6 as quicksave hotkey
        JPC_RegisterKeyBind(VK_F6, QUICK_SAVE_KEY_STRING);
        // Register F7 as quickload hotkey
        JPC_RegisterKeyBind(VK_F7, QUICK_LOAD_KEY_STRING);
    })();
}

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