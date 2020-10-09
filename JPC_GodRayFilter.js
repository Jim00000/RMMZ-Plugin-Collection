//=============================================================================
// RPG Maker MZ - God Ray Filter
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add god ray effect to the game map.
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_GodRayFilter.js
 * @base JPC_Core
 * @help
 * This is an official filter provided by PiXiJS (Alain Galvan).
 *
 * Visit https://pixijs.io/pixi-filters/tools/demo/ for a live demo of Godray
 * filter.
 *
 * https://pixijs.io/pixi-filters/docs/PIXI.filters.GodrayFilter.html offers
 * details about every parameters.
 *
 * The shader file (godray.fs) comes from
 * https://github.com/pixijs/pixi-filters/tree/master/filters/godray/src
 * and has a few modifications.
 *
 * In the map properties editor, you can set parameters to the map by writing
 * following metadata with xml format in the note. Giving an example:
 *
 * <jpc>
 *   <godrayfilter>
 *     <enable>true</enable>
 *     <delta>0.001</delta>
 *     <angle>15</angle>
 *     <gain>0.5</gain>
 *     <lacunrity>2.8</lacunrity>
 *     <parallel_light>false</parallel_light>
 *     <lightsource>[-100, -100]</lightsource>
 *     <lightcolor>[1.0, 1.0, 1.0]</lightcolor>
 *   </godrayfilter>
 * </jpc>
 *
 * Note that the filter will pick the default value defined in the plugin
 * manager if you do not give specific value to the parameter in the xml.
 *
 * @param delta
 * @text Delta
 * @type number
 * @default 0.01
 * @decimals 3
 * @min 0.0
 * @max 10.0
 *
 * @param angle
 * @text Angle
 * @type number
 * @default 30.0
 * @decimals 3
 * @min 0.0
 * @max 360.0
 *
 * @param gain
 * @text Gain
 * @type number
 * @default 0.6
 * @decimals 3
 * @min 0.0
 *
 * @param lacunrity
 * @text Lacunrity
 * @type number
 * @default 2.8
 * @decimals 3
 * @min 0.0
 *
 * @param parallel
 * @text Parallel light
 * @type boolean
 * @default false
 *
 * @param lightsrc
 * @text light source
 * @type number[]
 * @decimals 3
 * @default [0.0, -100.0]
 * @min -10000.0
 * @max 10000.0
 *
 * @param lightcolor
 * @text light color
 * @desc Set the light color (r, g, b) of God Ray filter. Default is white : (r = 1.0, g = 1.0, b = 1.0).
 * @type number[]
 * @decimal 3
 * @default [1.00, 1.00, 1.00]
 * @min 0.0
 * @max 1.0
 *
 * @param switchid
 * @type switch
 * @desc Activate godray filter only when this switch is ON.
 * @default 1
 *
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JPC_GodRayFilter';
    const GOD_RAY_SHADER_PATH = 'js/plugins/shaders/godray.fs';
    const PLUGINPARAMS = JPC.getPluginParams(PLUGIN_NAME);

    //=============================================================================
    // Parameters
    //=============================================================================
    const DELTA = JPC.toGeneric(PLUGINPARAMS.delta).toFloat();
    const ANGLE = JPC.toGeneric(PLUGINPARAMS.angle).toFloat();
    const GAIN = JPC.toGeneric(PLUGINPARAMS.gain).toFloat();
    const LACUNRITY = JPC.toGeneric(PLUGINPARAMS.lacunrity).toFloat();
    const IS_LIGHT_PARALLEL = JPC.toGeneric(PLUGINPARAMS.parallel).toBool();
    const LIGHTSRC = JPC.toGeneric(PLUGINPARAMS.lightsrc).toFloatArray();
    const LIGHTCOLOR = JPC.toGeneric(PLUGINPARAMS.lightcolor).toFloatArray();
    const SWITCH_ID = JPC.toGeneric(PLUGINPARAMS.switchid).toInt();

    class GodRay {
        constructor() {
            this.xmlParams = JPC.parseJPCParams($dataMap.note);
            this.delta = JPC.select(this.xmlParams.query('godrayfilter.delta').toFloat(), DELTA);
            this.angle = JPC.select(this.xmlParams.query('godrayfilter.angle').toInt(), ANGLE);
            this.gain = JPC.select(this.xmlParams.query('godrayfilter.gain').toFloat(), GAIN);
            this.lacunrity = JPC.select(this.xmlParams.query('godrayfilter.lacunrity').toFloat(), LACUNRITY);
            this.isLightParallel =
                JPC.select(this.xmlParams.query('godrayfilter.parallel_light').toBool(), IS_LIGHT_PARALLEL);
            this.lightSrc = JPC.select(this.xmlParams.query('godrayfilter.lightsource').toFloatArray(), LIGHTSRC);
            this.lightColor = JPC.select(this.xmlParams.query('godrayfilter.lightcolor').toFloatArray(), LIGHTCOLOR);
            this.filter = this.createGodRayFilter();
        };
    };

    GodRay.prototype.degToRad = function(degree) {
        return degree * Math.PI / 180.0;
    };

    GodRay.prototype.createGodRayFilter = function() {
        console.debug(this.lacunrity);
        const filter = JPC.createFilter(GOD_RAY_SHADER_PATH, {
            angle: this.angle,
            gain: this.gain,
            uLacunrity: this.lacunrity,
            parallel: this.isLightParallel,
            dimensions: [Graphics.boxWidth, Graphics.boxHeight],
            aspect: Graphics.boxHeight / Graphics.boxWidth,
            light: this.isLightParallel ? [Math.cos(this.degToRad(this.angle)), Math.sin(this.degToRad(this.angle))] :
                                          this.lightSrc,
            lightColor: this.lightColor,
            utime: 0
        });
        return filter;
    };

    GodRay.prototype.update = function() {
        this.filter.enabled = $gameSwitches.value(SWITCH_ID);
        this.filter.uniforms.utime += this.delta;
        if (this.isLightParallel === false) {
            this.filter.uniforms.light[0] = this.lightSrc[0] - $gameMap.displayX() * $gameMap.tileWidth();
            this.filter.uniforms.light[1] = this.lightSrc[1] - $gameMap.displayY() * $gameMap.tileHeight();
        }
    };

    var _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.godray = new GodRay();
        this.filters.push(this.godray.filter);
    };

    var _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.godray.update();
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
