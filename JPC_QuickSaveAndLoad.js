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
 * @ --- Enable / Disable ---
 *
 * @param rootdir_enable_disable
 * @text Enable / Disable
 *
 * @param enable_quicksave_system
 * @parent rootdir_enable_disable
 * @text Activate quick save/load system
 * @desc Is quicksave system activated ? (Note. this option is ineffective if bound to a certain RPG Maker switches)
 * @type boolean
 * @default true
 * @on Enable
 * @off Disable
 *
 * @param rm_switch_activity
 * @parent rootdir_enable_disable
 * @text bound to RPG Maker switches
 * @desc Default is 0 which means it doesn't bind a RM switch.
 * Through bound to a switch, you can turn on/off the system.
 * @type switch
 * @default 0
 *
 * @ --- Options ---
 *
 * @param rootdir_options
 * @text Options
 *
 * @param quick_save_name
 * @parent rootdir_options
 * @text Save file name
 * @desc The file name of quick save
 * @type string
 * @default quicksave
 *
 * @param output_notification_msg
 * @parent rootdir_options
 * @text Notification
 * @desc Whether quicksaving notification should be displayed.
 * @type boolean
 * @default true
 * @on Display
 * @off Not display
 *
 * @param quick_save_notification_msg
 * @parent rootdir_options
 * @text Quick save text
 * @desc The notification text while quicksaving is done.
 * @type string
 * @default Quicksaving...
 *
 * @param quick_load_notification_msg
 * @parent rootdir_options
 * @text Quick load text
 * @desc The notification text while quickloading is done.
 * @type string
 * @default Quickloading...
 *
 * @param quick_save_key
 * @parent rootdir_options
 * @text quick save key
 * @desc The key to quick save. Input should be a virtual key.
 * @type number
 * @default 117
 *
 * @param quick_load_key
 * @parent rootdir_options
 * @text quick load key
 * @desc The key to quick load. Input should be a virtual key.
 * @type number
 * @default 118
 *
 * @ --- Command ---
 *
 * @command enableQuickSaveSystem
 * @text Enable
 * @desc Activate quick save system.
 *
 * @command disableQuickSaveSystem
 * @text Disable
 * @desc Deactivate quick save system.
 * 
 * @command enableNotification
 * @text Enable quicksave message
 * @desc Output message after quick save or quick load is finished.
 * 
 * @command disableNotification
 * @text Disable quicksave message
 * @desc No output message after quick save or quick load is finished.
 * 
 */

(async (pluginName, pluginParams) => {
    'use strict';

    ///////////////////////////////////////////////////////
    /////               Plugin Commands               /////
    ///////////////////////////////////////////////////////
    PluginManager.registerCommand(pluginName, 'enableQuickSaveSystem', args => {
        JPC.quicksave.__isEnabled = true;
        if (JPC.quicksave.__rm_switch_activity !== 0) $gameSwitches.setValue(JPC.quicksave.__rm_switch_activity, true);
    });

    PluginManager.registerCommand(pluginName, 'disableQuickSaveSystem', args => {
        JPC.quicksave.__isEnabled = false;
        if (JPC.quicksave.__rm_switch_activity !== 0) $gameSwitches.setValue(JPC.quicksave.__rm_switch_activity, false);
    });

    PluginManager.registerCommand(pluginName, 'enableNotification', args => {
        JPC.quicksave.__isEnabledNotification = true;
    });

    PluginManager.registerCommand(pluginName, 'disableNotification', args => {
        JPC.quicksave.__isEnabledNotification = false;
    });

    JPC.quicksave = {};

    // is quick save system activated
    JPC.quicksave.isEnabled = function() {
        if (JPC.quicksave.__rm_switch_activity !== 0) return $gameSwitches.value(JPC.quicksave.__rm_switch_activity);
        return JPC.quicksave.__isEnabled;
    };

    JPC.import['core_typeconverter'].then(() => {
        JPC.quicksave.__isEnabled = JPC.core.typeconverter.toBoolean(pluginParams.enable_quicksave_system);
        JPC.quicksave.__rm_switch_activity = JPC.core.typeconverter.toNumber(pluginParams.rm_switch_activity);
        JPC.quicksave.__isEnabledNotification = JPC.core.typeconverter.toBoolean(pluginParams.output_notification_msg);
    });

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
                .then(() => {
                    if (JPC.quicksave.__isEnabledNotification) {
                        JPC.notifier.notify(pluginParams.quick_save_notification_msg);
                    }
                });
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
                })
                .catch(() => {
                    SoundManager.playBuzzer();
                })
                .then(() => {
                    if (JPC.quicksave.__isEnabledNotification) {
                        JPC.notifier.notify(pluginParams.quick_load_notification_msg);
                    }
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
        if (JPC.quicksave.isEnabled() === true) {
            if (!SceneManager.isSceneChanging()) {
                QuickSaveLoad.updateCallQuickSave();
            }
            if (!SceneManager.isSceneChanging()) {
                QuickSaveLoad.updateCallQuickLoad();
            }
        }
    };

    const _Scene_Title__update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title__update.apply(this, arguments);
        if (JPC.quicksave.isEnabled() === true) {
            if (!SceneManager.isSceneChanging()) {
                QuickSaveLoad.updateCallQuickLoad();
            }
        }
    };
})(JPC.getPluginName(document), JPC.getPluginParams(document));

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