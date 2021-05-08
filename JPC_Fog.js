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
 * @plugindesc Add fog effect to the map
 * @author Jim00000
 * @url
 * @base JPC_Core
 * @help
 *
 * @param gameswitchid
 * @text switch ID
 * @desc This switch id controls the fog effect is enabled or not.
 * @type number
 * @min 0
 *
 * @param speed
 * @text move speed of fog
 * @desc The movement speed of fog (x, y).
 * @type number[]
 * @decimals 5
 * @default [0.00000, 0.00000]
 * @min 0.0
 *
 * @param fogcolor
 * @text fog color
 * @desc This parameter configs the fog color in (R, G, B).
 * @type number[]
 * @decimals 3
 * @default [1.000, 1.000, 1.000]
 * @min 0.0
 * @min 1.0
 *
 * @param opacity
 * @text opacity
 * @desc This parameter controls the opacity of the fog effect.
 * @type number
 * @decimals 3
 * @default 0.500
 * @min 0.000
 * @min 1.000
 */

JPC.import['fog'] = (async (pluginName, pluginParams) => {
    'use strict';

    JPC.fog = {};
    JPC.fog.__version = 'wip';

    // Waiting for JPC core is ready
    await JPC.import['core'];

    let fog_module = {};

    // Load fog module
    const fog_promise = import('./jpc/fog/fog.js').then(_fog_module => {
        fog_module = _fog_module.__fog;
        JPC.core.log.debug('Dynamic importing fog module is done.');
    });

    // Waiting for fog module is ready.
    await fog_promise;

    // Loading plugin is complete.
    JPC.core.log.debug(`${pluginName} is ready.`);
})(...JPC.getPluginInfo(document));

/*
(() => {
    //=============================================================================
    // Parameters
    //=============================================================================
    const SPEED_XY = JPC.toGeneric(PLUGIN_PARAMS.speed).toFloatArray();
    const FOG_COLOR = JPC.toGeneric(PLUGIN_PARAMS.fogcolor).toFloatArray();
    const OPACITY = JPC.toGeneric(PLUGIN_PARAMS.opacity).toFloat();
    const FOG_SWITCH_ID = JPC.toGeneric(PLUGIN_PARAMS.gameswitchid).toFloat();
})();
*/