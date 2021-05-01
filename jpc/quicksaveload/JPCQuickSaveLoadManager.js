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

'use strict';

function getQuickSavefileId() {
    return DataManager.maxSavefiles() + 1;
};

function fadeInOut() {
    const time = Scene_Load.prototype.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    $gameScreen.startFadeOut(Scene_Load.prototype.slowFadeSpeed());
    $gameScreen.startFadeIn(Scene_Load.prototype.slowFadeSpeed());
};

export default class JPCQuickSaveLoadManager {
    static save(saveName, notification = '') {
        const quickSavefileId = getQuickSavefileId();
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
            .then(() => {
                SoundManager.playSave();
                if (JPC.quicksave.isNotificationEnabled()) {
                    JPC.core.notifier.notify(notification, 1000);
                }
            })
            .catch(() => SoundManager.playBuzzer());
    };

    static load(saveName, notification = '') {
        StorageManager.loadObject(saveName)
            .then(contents => {
                DataManager.createGameObjects();
                DataManager.extractSaveContents(contents);
                DataManager.correctDataErrors();
            })
            .then(() => {
                SoundManager.playLoad();
                fadeInOut();
                SceneManager.goto(Scene_Map);
                Scene_Load.prototype.reloadMapIfUpdated();
                if (JPC.quicksave.isNotificationEnabled()) {
                    JPC.core.notifier.notify(notification, 1000);
                }
            })
            .catch(() => {
                SoundManager.playBuzzer();
            });
    };
};