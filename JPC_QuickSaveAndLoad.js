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
 * @plugindesc A simple, skyrim style like quick save and quick load system.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_QuickSaveAndLoad.js
 * @base JPC_Core
 * @help
 * QuickSaveAndLoad v1.0.0
 *
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
 * ◼️ Plugin Commands
 *
 * ▷ enableQuickSaveSystem  : enable quick save system
 *
 * ▷ disableQuickSaveSystem : disable quick save system
 *
 * ▷ enableNotification     : enable quick save notification
 *
 * ▷ disableNotification    : disable quick save notification
 *
 * ◼️ Change Log
 *
 * ✻ v1.0.0
 *   ▷ Initial release
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
 * @ --- Enable quick save ---
 *
 * @param enable_quicksave_system
 * @text Enable quick save/load system
 * @desc Is quicksave system activated ? (Note. this option is ineffective if bound to a certain RPG Maker switches)
 * @type boolean
 * @default true
 * @on Enable
 * @off Disable
 *
 * @param rm_switch_activity
 * @parent enable_quicksave_system
 * @text Bound to RPG Maker switch
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
 * @parent output_notification_msg
 * @text Quick save notification message
 * @desc The notification text while quicksaving is done.
 * @type string
 * @default Quicksaving...
 *
 * @param quick_load_notification_msg
 * @parent output_notification_msg
 * @text Quick load notification message
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

JPC.import['quicksaveandload'] = (async (pluginName, pluginParams) => {
    'use strict';

    JPC.quicksave = {};
    JPC.quicksave.__version = '1.0.0';

    // Waiting for JPC core is ready
    await JPC.import['core'];

    let qsl_module = {};

    // Load quicksaveload module
    // clang-format off
    const qsl_promise = import('./jpc/quicksaveload/quicksaveload.js').then(_qsl_module => {
        qsl_module = _qsl_module.__quicksaveload;
    }).catch(() => {
        throw new Error("Cannot initialize quicksaveload module");
    });
    // clang-format on
    // Waiting for quicksaveload module is ready.
    await qsl_promise;

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

    // is quick save system activated
    JPC.quicksave.isEnabled = function() {
        if (JPC.quicksave.__rm_switch_activity !== 0)
            return $gameSwitches.value(JPC.quicksave.__rm_switch_activity);
        else
            return JPC.quicksave.__isEnabled;
    };

    // is quick save notification activated
    JPC.quicksave.isNotificationEnabled = function() {
        return JPC.quicksave.__isEnabledNotification;
    };

    JPC.quicksave.__isEnabled = JPC.core.type.toBoolean(pluginParams.enable_quicksave_system);
    JPC.quicksave.__rm_switch_activity = JPC.core.type.toNumber(pluginParams.rm_switch_activity);
    JPC.quicksave.__isEnabledNotification = JPC.core.type.toBoolean(pluginParams.output_notification_msg);

    const quickSaveName = pluginParams.quick_save_name ?? 'quicksave';

    // Register quicksave hotkey in map.
    JPC.core.input.mapInput.register(
        pluginParams.quick_save_key, 'QuickSave', qsl_module.onQuickSave,
        {saveName: quickSaveName, notification: pluginParams.quick_save_notification_msg});
    // Register quickload hotkey in both title and map.
    JPC.core.input.mapInput.register(
        pluginParams.quick_load_key, 'QuickLoad', qsl_module.onQuickLoad,
        {saveName: quickSaveName, notification: pluginParams.quick_load_notification_msg});
    JPC.core.input.titleInput.register(
        pluginParams.quick_load_key, 'QuickLoad', qsl_module.onQuickLoad,
        {saveName: quickSaveName, notification: pluginParams.quick_load_notification_msg});

    // Loading plugin is complete.
    JPC.core.log.debug(`${pluginName} is ready.`);
})(...JPC.getPluginInfo(document));