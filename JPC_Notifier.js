//=============================================================================
// RPG Maker MZ - Notifier
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add a tiny notifier to tell information or status to the player.
 * @author Jim00000
 * @help 
 */

var JPCNotifier = null;

//=============================================================================
// Window_Notifier
//=============================================================================

function Window_JPCNotifier() {
    this.initialize(...arguments);
}

Window_JPCNotifier.prototype = Object.create(Window_Base.prototype);

Window_JPCNotifier.prototype.constructor = Window_JPCNotifier;

Window_JPCNotifier.prototype.initialize = function () {
    Window_Base.prototype.initialize.call(this, new Rectangle(-10, -20, Graphics.boxWidth, Window_Base.prototype.fittingHeight(1)));
    this.move(-10, -20, 0, Window_Base.prototype.fittingHeight(1));
    this._text = "";
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 16;
    this.backOpacity = 0;
    this.opacity = 0; // Disable background frame
    this._duration = 3000; // in milliseconds
    this.contentsOpacity = 0;
    this._start_timestamp = new Date().getTime();
    this._isBusy = false;
    this.refresh();
};

Window_JPCNotifier.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._isBusy) {
        if (this.isExpired() == false) {
            this.contentsOpacity += 8;
        } else {
            this.contentsOpacity -= 8;
            if (this.contentsOpacity <= 0) {
                this.contentsOpacity = 0;
                this._isBusy = false;
                this.clearText();
                this.move(-10, -20, 0, Window_Base.prototype.fittingHeight(1));
            }
        }
    }
}

Window_JPCNotifier.prototype.open = function () {
    Window_Base.prototype.open.call(this);
    this.move(-10, -20, Graphics.boxWidth, Window_Base.prototype.fittingHeight(1));
    this._isBusy = true;
    this.contentsOpacity = 0;
    this._start_timestamp = new Date().getTime();
    this.refresh();
}

Window_JPCNotifier.prototype.refresh = function () {
    this.contents.clear();
    this.drawText(this._text, 0, 0, this.innerWidth, "left");
}

Window_JPCNotifier.prototype.isExpired = function () {
    const current_timestamp = new Date().getTime();
    return current_timestamp > (this._start_timestamp + this._duration);
}

Window_JPCNotifier.prototype.setText = function (text) {
    this._text = text;
}

Window_JPCNotifier.prototype.clearText = function () {
    this._text = "";
}

Window_JPCNotifier.prototype.isBusy = function () {
    return this._isBusy;
}

{
    //=============================================================================
    // Renew Scene_Map
    //=============================================================================
    const _Scene_Map__create = Scene_Map.prototype.createMenuButton;
    Scene_Map.prototype.createMenuButton = function () {
        _Scene_Map__create.apply(this, arguments);
        JPCNotifier = new Window_JPCNotifier();
        this.addWindow(JPCNotifier);
    };
}