//=============================================================================
// RPG Maker MZ - Lighting
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add lighting effect (WIP)
 * @author Jim00000
 * @url https://github.com/Jim00000/RMMZ-Plugin-Collection/blob/master/JPC_Lighting.js
 * @base JPC_Core
 * @help
 * Lighting Work-In-Progress
 *
 * ◼️ Introduction
 *
 * This script adds point light or spotlight effect to the player or objects on the map.
 *
 * ◼️ Remarks
 *
 * Make sure every light event name should be unique. Otherwise, you may encounter some problems.
 *
 * ◼️ MIT License
 *
 * Copyright (c) 2021 Jim00000
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
 * @ --- Command ---
 *
 * @command enableLightingSystem
 * @text Enable JPC lighting system
 * @desc Enable JPC lighting system (effect on all lighting events and player).
 *
 * @command disableLightingSystem
 * @text Disable JPC lighting system
 * @desc Disable JPC lighting system (effect on all lighting events and player).
 *
 * @command setGlobalIllumination
 * @text Set global illumination
 * @desc Set global illumination to the map. Range from 0 to 1.
 *
 * @arg global_illumination
 * @text global illumination
 * @desc Set global illumination [0.000, 1.000].
 * @type number
 * @default 1.000
 * @min 0.000
 * @max 1.000
 * @decimals 3
 *
 * @command toggleLight
 * @text Toggle light (event)
 * @desc Toggle light on events identified by event name.
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg enabled
 * @text enable
 * @type boolean
 * @default true
 * @on Enable
 * @off Disable
 *
 * @command setRChannel
 * @text Set R channel (event)
 * @desc Set R channel given an event name.
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg r
 * @text r
 * @desc R channel (red color) [0.000 ~ ∞].
 * @type number
 * @default 1.000
 * @min 0.000
 * @decimals 3
 *
 * @command setGChannel
 * @text Set G channel (event)
 * @desc Set G channel given an event name.
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg g
 * @text g
 * @desc G channel (green color) [0.000 ~ ∞].
 * @type number
 * @default 1.000
 * @min 0.000
 * @decimals 3
 *
 * @command setBChannel
 * @text Set B channel (event)
 * @desc Set B channel given an event name.
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg b
 * @text b
 * @desc b channel (blue color) [0.000 ~ ∞].
 * @type number
 * @default 1.000
 * @min 0.000
 * @decimals 3
 *
 * @command setPointLightRadius
 * @text Set point light radius (event)
 * @desc set the radius of point light given an event name.
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg radius
 * @text radius
 * @desc radius of point light source.
 * @type number
 * @default 128
 * @min 0
 *
 * @command setSpotLightRadius
 * @text Set spot light radius (event)
 * @desc set the radius of spot light given an event name.
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg radius
 * @text radius
 * @desc radius of spot light source.
 * @type number
 * @default 128
 * @min 0
 *
 * @command setLightDirection
 * @text Set spot light direction (event)
 * @desc Set spot light direction (Up, Down, Left, Right).
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg direction
 * @text direction
 * @desc Spot light direction.
 * @type select
 *
 * @option Up
 * @value 8
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @default Down
 *
 * @command setFOV
 * @text Set FOV for spot light (event)
 * @desc Set field of view for a certain spot light given an event name
 *
 * @arg event_name
 * @text event name
 * @desc event name to identify. Be careful that every event name should be unique.
 * @type text
 *
 * @arg fov
 * @text field of view
 * @desc field of view (in angle).
 * @type number
 * @default 30
 * @min 1
 * @max 90
 * 
 * @ --- Command (Player) ---
 * 
 * @command togglePlayerLight
 * @text Toggle light (player)
 * @desc Toggle light on player.
 *
 * @arg enabled
 * @text enable
 * @type boolean
 * @default true
 * @on Enable
 * @off Disable
 * 
 * @command setPlayerRChannel
 * @text Set R channel (player)
 * @desc Set R channel on player.
 *
 * @arg r
 * @text r
 * @desc R channel (red color) [0.000 ~ ∞].
 * @type number
 * @default 1.000
 * @min 0.000
 * @decimals 3
 * 
 * @command setPlayerGChannel
 * @text Set G channel (player)
 * @desc Set G channel on player.
 *
 * @arg g
 * @text g
 * @desc G channel (green color) [0.000 ~ ∞].
 * @type number
 * @default 1.000
 * @min 0.000
 * @decimals 3
 * 
 * @command setPlayerBChannel
 * @text Set B channel (player)
 * @desc Set B channel on player.
 *
 * @arg b
 * @text b
 * @desc B channel (blue color) [0.000 ~ ∞].
 * @type number
 * @default 1.000
 * @min 0.000
 * @decimals 3
 * 
 * @command setPlayerPointLightRadius
 * @text Set point light radius (player)
 * @desc Set the radius of point light on player.
 * 
 * @arg radius
 * @text radius
 * @desc radius of point light source.
 * @type number
 * @default 128
 * @min 0
 * 
 * @command setPlayerSpotLightRadius
 * @text Set spot light radius (player)
 * @desc Set the radius of spot light on player.
 * 
 * @arg radius
 * @text radius
 * @desc radius of spot light source.
 * @type number
 * @default 128
 * @min 0
 * 
 * @command setPlayerFOV
 * @text Set FOV for spot light on player
 * @desc Set field of view on player
 *
 * @arg fov
 * @text field of view
 * @desc field of view (in angle).
 * @type number
 * @default 30
 * @min 1
 * @max 90
 * 
 * @command setPlayerLightType
 * @text Set player light type (player)
 * @desc Set player light type (point | spot) on player.
 * 
 * @arg lighttype_point
 * @text point light
 * @desc Enable point light
 * @type boolean
 * @default false
 * @on Enabled
 * @off Disabled
 * 
 * @arg lighttype_spot
 * @text spot light
 * @desc Enable point light
 * @type boolean
 * @default false
 * @on Enabled
 * @off Disabled
 */

(async (pluginName, pluginParams) => {
    'use strict';

    JPC.lighting = {};
    JPC.lighting.__version = 'wip';
    JPC.lighting.manager = null;
    JPC.lighting.enable = false;
    JPC.lighting.global_illumination = 1.0;

    ///////////////////////////////////////////////////////
    /////               Plugin Commands               /////
    ///////////////////////////////////////////////////////

    PluginManager.registerCommand(pluginName, 'enableLightingSystem', () => {
        JPC.core.logger.debug(`Call ${pluginName}:enableLightingSystem command.`);
        JPC.lighting.enable = true;
        JPC.core.logger.debug(`JPC lighting system activates.`);
    });

    PluginManager.registerCommand(pluginName, 'disableLightingSystem', () => {
        JPC.core.logger.debug(`Call ${pluginName}:disableLightingSystem command.`);
        JPC.lighting.enable = false;
        JPC.core.logger.debug(`JPC lighting system deactivates.`);
    });

    PluginManager.registerCommand(pluginName, 'setGlobalIllumination', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setGlobalIllumination command.`);
        JPC.lighting.global_illumination = args.global_illumination;
        JPC.core.logger.debug(`Global illumination is set to ${JPC.lighting.global_illumination}`);
    });

    PluginManager.registerCommand(pluginName, 'toggleLight', args => {
        JPC.core.logger.debug(`Call ${pluginName}:toggleLight command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.is_light_source = JPC.core.typeconverter.toBoolean(args.enabled);
            if (event.is_light_source === true)
                JPC.core.logger.debug(`Light event ${args.event_name} is enabled.`);
            else
                JPC.core.logger.debug(`Light event ${args.event_name} is disabled.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setRChannel', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setRChannel command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.r = args.r;
            JPC.core.logger.debug(`Event ${args.event_name} R channel is changed to ${event.r}.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setGChannel', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setGChannel command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.g = args.g;
            JPC.core.logger.debug(`Event ${args.event_name} G channel is changed to ${event.g}.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setBChannel', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setBChannel command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.b = args.b;
            JPC.core.logger.debug(`Event ${args.event_name} B channel is changed to ${event.b}.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setPointLightRadius', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPointLightRadius command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.pointlight_radius = args.radius;
            JPC.core.logger.debug(`Event ${args.event_name} point light radius is changed to ${args.radius}.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setSpotLightRadius', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setSpotLightRadius command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.spotlight_radius = args.radius;
            JPC.core.logger.debug(`Event ${args.event_name} spot light radius is changed to ${args.radius}.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setLightDirection', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setLightDirection command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.direction = args.direction;
            JPC.core.logger.debug(`Event ${args.event_name} direction is changed to ${
                JLightingDirection.prototype.toString(args.direction)}.`);
        } else {
            JPC.core.logger.warn(
                `Target event ${JLightingDirection.prototype.toString(args.direction)} cannot be found.`);
        }
    });

    PluginManager.registerCommand(pluginName, 'setFOV', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setFOV command.`);
        const event = JPC.lighting.manager.objConfigsNameTable[args.event_name];
        if (event !== undefined && event !== null) {
            JPC.core.logger.debug(`Target event ${args.event_name} is found.`);
            event.fov = JPC.core.typeconverter.toNumber(args.fov);
            JPC.core.logger.debug(`Event ${args.event_name} fov is changed to ${args.fov}.`);
        } else {
            JPC.core.logger.warn(`Target event ${args.event_name} cannot be found.`);
        }
    });

    // plugin commands for player
    PluginManager.registerCommand(pluginName, 'togglePlayerLight', args => {
        JPC.core.logger.debug(`Call ${pluginName}:togglePlayerLight command.`);
        JPC.lighting.player.is_light_source = JPC.core.typeconverter.toBoolean(args.enabled);
        if (JPC.lighting.player.is_light_source === true)
            JPC.core.logger.debug(`Light source of player is enabled.`);
        else
            JPC.core.logger.debug(`Light source of player is disabled.`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerRChannel', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerRChannel command.`);
        JPC.lighting.player.r = JPC.core.typeconverter.toNumber(args.r);
        JPC.core.logger.debug(`Set R channel to ${JPC.lighting.player.r} on Player`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerGChannel', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerGChannel command.`);
        JPC.lighting.player.g = JPC.core.typeconverter.toNumber(args.g);
        JPC.core.logger.debug(`Set G channel to ${JPC.lighting.player.g} on Player`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerBChannel', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerBChannel command.`);
        JPC.lighting.player.b = JPC.core.typeconverter.toNumber(args.b);
        JPC.core.logger.debug(`Set B channel to ${JPC.lighting.player.b} on Player`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerPointLightRadius', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerPointLightRadius command.`);
        JPC.lighting.player.pointlight_radius = JPC.core.typeconverter.toNumber(args.radius);
        JPC.core.logger.debug(`Set point light radius to ${JPC.lighting.player.pointlight_radius} on Player`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerSpotLightRadius', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerSpotLightRadius command.`);
        JPC.lighting.player.spotlight_radius = JPC.core.typeconverter.toNumber(args.radius);
        JPC.core.logger.debug(`Set spot light radius to ${JPC.lighting.player.spotlight_radius} on Player`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerFOV', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerFOV command.`);
        JPC.lighting.player.fov = JPC.core.typeconverter.toNumber(args.fov);
        JPC.core.logger.debug(`Set FOV to ${JPC.lighting.player.fov} on Player`);
    });

    PluginManager.registerCommand(pluginName, 'setPlayerLightType', args => {
        JPC.core.logger.debug(`Call ${pluginName}:setPlayerLightType command.`);
        JPC.lighting.player.lighttype = 0;
        
        if(JPC.core.typeconverter.toBoolean(args.lighttype_point) === true){
            JPC.lighting.player.lighttype |= JLightingType.PointLight;
            JPC.core.logger.debug('Enable point light type on Player');
        }

        if(JPC.core.typeconverter.toBoolean(args.lighttype_spot) === true) {
            JPC.lighting.player.lighttype |= JLightingType.SpotLight;
            JPC.core.logger.debug('Enable spot light type on Player');
        }
    });

    // Awating jpc.core.logger is ready.
    await JPC.import['core_logger'];
    // Awating jpc.core.typeconverter is ready.
    await JPC.import['core_typeconverter'];
    // Awating jpc.core.xmlparser is ready.
    await JPC.import['core_xmlparser'];
    // Awating jpc.core.glsl is ready.
    await JPC.import['core_glsl'];
    // Awating jpc.core.miscellany is ready.
    await JPC.import['core_miscellany'];

    class JLightingType {
        static get PointLight() {
            return 0b01;
        };

        static get SpotLight() {
            return 0b10;
        };
    };

    JLightingType.prototype.parse = function(string) {
        switch (string.toLowerCase()) {
            case 'point':
                return JLightingType.PointLight;
            case 'spot':
                return JLightingType.SpotLight;
            case 'both':
                return JLightingType.PointLight | JLightingType.SpotLight;
            default:
                return undefined;
        }
    };

    class JLightingDirection {
        static get Down() {
            return 2;
        };

        static get Left() {
            return 4;
        };

        static get Right() {
            return 6;
        };

        static get Up() {
            return 8;
        };
    };

    JLightingDirection.prototype.parse = function(string) {
        switch (string.toLowerCase()) {
            case 'down':
                return JLightingDirection.Down;
            case 'left':
                return JLightingDirection.Left;
            case 'right':
                return JLightingDirection.Right;
            case 'up':
                return JLightingDirection.Up;
            default:
                return undefined;
        }
    };

    JLightingDirection.prototype.toString = function(val) {
        switch (Number(val)) {
            case JLightingDirection.Down:
                return 'Down';
            case JLightingDirection.Left:
                return 'Left';
            case JLightingDirection.Right:
                return 'Right';
            case JLightingDirection.Up:
                return 'Up';
            default:
                return undefined;
        }
    };

    // This class contains metadata of the game map related to lighting.
    class JLightingMapConfig extends JPC.core.xmlparser.XMLDocument {
        constructor(text) {
            super(text);
            const select = JPC.core.misc.select;
            JPC.lighting.enable =
                select(this.query('jpc', 'lighting', 'enable').boolean, JLightingMapDefaultConfig.enable);
            JPC.lighting.global_illumination = select(
                this.query('jpc', 'lighting', 'global_illumination').number,
                JLightingMapDefaultConfig.global_illumination);
        };

        get enable() {
            return JPC.lighting.enable;
        };

        get global_illumination() {
            return JPC.lighting.global_illumination;
        };

        set global_illumination(value) {
            JPC.lighting.global_illumination = value;
        };
    };

    // default configuration of game map setting
    class JLightingMapDefaultConfig {
        static get enable() {
            return false;
        };

        static get global_illumination() {
            return 1.0;
        };
    };

    class JLightingCommonConfig {
        #_x
        #_y
        #_r
        #_g
        #_b
        #_is_light_source
        #_pointlight_radius
        #_spotlight_radius
        #_fov
        #_lighttype
        #_delta;

        constructor() {
            this.#_x = 0;
            this.#_y = 0;
            this.#_r = 1.0;
            this.#_g = 1.0;
            this.#_b = 1.0;
            this.#_is_light_source = false;
            this.#_pointlight_radius = 128.0;
            this.#_spotlight_radius = 128.0;
            this.#_fov = 15.0;
            this.#_lighttype = JLightingType.PointLight;
            this.#_delta = this.createDelta();
        };

        get x() {
            return this.#_x;
        };

        get y() {
            return this.#_y;
        };

        get r() {
            return this.#_r;
        };

        get g() {
            return this.#_g;
        };

        get b() {
            return this.#_b;
        };

        get is_light_source() {
            return this.#_is_light_source;
        };

        get pointlight_radius() {
            return this.#_pointlight_radius;
        };

        get spotlight_radius() {
            return this.#_spotlight_radius;
        };

        get fov() {
            return this.#_fov;
        };

        get lighttype() {
            return this.#_lighttype;
        };

        get delta() {
            return this.#_delta;
        }

        set is_light_source(bool) {
            this.#_is_light_source = bool;
        };

        set pointlight_radius(radius) {
            this.#_pointlight_radius = radius;
        };

        set spotlight_radius(radius) {
            this.#_spotlight_radius = radius;
        };

        set fov(fov) {
            this.#_fov = fov;
        };

        set lighttype(type) {
            this.#_lighttype = type;
        };

        set x(x) {
            this.#_x = x;
        };

        set y(y) {
            this.#_y = y;
        };

        set r(r) {
            this.#_r = r;
        };

        set g(g) {
            this.#_g = g;
        };

        set b(b) {
            this.#_b = b;
        };
    };

    JLightingCommonConfig.prototype.createDelta = function() {
        return 0.4 + 0.6 * (Math.random() - 0.5);
    };

    class JLightingPlayerConfig extends JLightingCommonConfig {
        constructor() {
            super();
            this.is_light_source = true;
        };
    };

    // player's lighting config
    JPC.lighting.player = new JLightingPlayerConfig();

    class JLightingObjectConfig extends JLightingCommonConfig {
        #_event_id
        #_event_name
        #_index
        #_light_direction

        constructor() {
            super();
            this.#_index = -1;
            this.#_event_id = -1;
            this.#_event_name = '';
            this.#_light_direction = JLightingDirection.Down;
        };

        get index() {
            return this.#_index;
        };

        get event_id() {
            return this.#_event_id;
        };

        get event_name() {
            return this.#_event_name;
        };

        get direction() {
            return this.#_light_direction;
        };

        set event_id(eid) {
            this.#_event_id = eid;
        };

        set event_name(name) {
            this.#_event_name = name;
        };

        set index(idx) {
            this.#_index = idx;
        }

        set direction(dir) {
            this.#_light_direction = dir;
        };
    };

    class JLightingInterpreter {
        #_lightConfigAlias

        constructor(config) {
            this.#_lightConfigAlias = config;
        };

        get config() {
            return this.#_lightConfigAlias;
        };
    };

    JLightingInterpreter.prototype.interpret = function(assign_statement) {
        const values = assign_statement.split('=');
        if (values.length == 2) {
            const lvalue = values[0].toLowerCase().trim();
            const rvalue = values[1].trim();
            this.onAssignment(lvalue, rvalue);
        }
    };

    JLightingInterpreter.prototype.onAssignment = function(lvalue, rvalue) {
        switch (lvalue) {
            case 'r':
                this.config.r = JPC.core.typeconverter.toNumber(rvalue);
                break;
            case 'g':
                this.config.g = JPC.core.typeconverter.toNumber(rvalue);
                break;
            case 'b':
                this.config.b = JPC.core.typeconverter.toNumber(rvalue);
                break;
            case 'is_light_source':
                this.config.is_light_source = JPC.core.typeconverter.toBoolean(rvalue);
                break;
            case 'pointlight_radius':
                this.config.pointlight_radius = JPC.core.typeconverter.toNumber(rvalue);
                break;
            case 'spotlight_radius':
                this.config.spotlight_radius = JPC.core.typeconverter.toNumber(rvalue);
                break;
            case 'fov':
                this.config.fov = JPC.core.typeconverter.toNumber(rvalue);
                break;
            case 'lighttype':
                this.config.lighttype = JLightingType.prototype.parse(rvalue);
                break;
            case 'direction':
                this.config.direction = JLightingDirection.prototype.parse(rvalue);
                break;
            default:
                JPC.core.logger.warn(`Unhandled case occurs. lvalue : ${lvalue}, rvalue : ${rvalue}`);
                break;
        };
    };

    class JLightingManager {
        #_mapConfig
        #_playerConfig
        #_playerSprite
        #_lightObjConfigsNameTable
        #_lightObjConfigsIdTable
        #_lightEventCount
        #_dispatch_index
        #_filter
        #_isInitialized

        constructor() {
            this.#_dispatch_index = 0;
            this.#_lightEventCount = 0;
            this.#_mapConfig = new JLightingMapConfig($dataMap.note);
            this.#_playerConfig = JPC.lighting.player;
            this.#_filter = this.createDefaultFilter();
            this.#_playerSprite = null;
            this.#_lightObjConfigsNameTable = {};
            this.#_lightObjConfigsIdTable = {};
            this.#_isInitialized = false;
            this.initializeLightEvent();
        };

        get dispatch_index() {
            return this.#_dispatch_index;
        };

        get isInitialized() {
            return this.#_isInitialized;
        };

        get filter() {
            return this.#_filter;
        };

        get playerSprite() {
            return this.#_playerSprite;
        };

        get playerConfig() {
            return this.#_playerConfig;
        };

        get mapConfig() {
            return this.#_mapConfig;
        };

        get objConfigsNameTable() {
            return this.#_lightObjConfigsNameTable;
        };

        get objConfigsIdTable() {
            return this.#_lightObjConfigsIdTable;
        };

        get lightEventCount() {
            return this.#_lightEventCount;
        };

        set isInitialized(bool) {
            this.#_isInitialized = bool;
        };

        set playerSprite(sprite) {
            this.#_playerSprite = sprite;
        };

        set lightEventCount(count) {
            this.#_lightEventCount = count;
        };

        set dispatch_index(idx) {
            this.#_dispatch_index = idx;
        };
    };

    JLightingManager.prototype.createDefaultFilter = function() {
        const MAX_LIGHTS = 32;
        const filter = JPC.core.glsl.createFilter('js/plugins/jpc/shaders/lighting.fs', {
            globalIllumination: this.mapConfig.global_illumination,
            pointRadius: new Float32Array(MAX_LIGHTS),
            lightCount: 0,  // unknown light source count
            positions: new Float32Array(MAX_LIGHTS * 2),
            times: new Float32Array(MAX_LIGHTS),
            colors: new Float32Array(MAX_LIGHTS * 3),
            FOV: new Float32Array(MAX_LIGHTS).fill(1.0),
            spotRadius: new Float32Array(MAX_LIGHTS).fill(1.0),
            types: new Int32Array(MAX_LIGHTS),
            directions: new Int32Array(MAX_LIGHTS)
        });
        return filter;
    };

    JLightingManager.prototype.initialize = function() {
        if (this.isInitialized === false) {
            // Find Player's sprite
            this.playerSprite = this.findPlayerSprite();
            // Initialize light event position. We can only get data
            // after Spriteset_Map starts to update.
            this.updateLightEventPosition();
            this.isInitialized = true;
        }
    };

    JLightingManager.prototype.updateLightEventPosition = function() {
        SceneManager._scene._spriteset._characterSprites.forEach(sprite => {
            if (sprite._character !== undefined && sprite._character instanceof Game_Event &&
                (sprite._character.eventId() in this.objConfigsIdTable)) {
                const event_id = sprite._character.eventId();
                let config = this.objConfigsIdTable[event_id];
                if (config !== null && config.is_light_source === true) {
                    config.x = sprite.position._x;
                    config.y = sprite.position._y;
                }
            }
        });
    };

    JLightingManager.prototype.initializeLightEvent = function() {
        // Initialize light events
        this.findLightEvent();
        // Update light source' count
        // One more count is for player
        this.filter.uniforms.lightCount = this.lightEventCount + 1;
    };

    JLightingManager.prototype.findLightEvent = function() {
        for (const event of $dataMap.events) {
            if (event !== null) {
                if (this.isLightEvent(event)) {
                    this.lightEventHandler(event);
                    this.lightEventCount += 1;
                }
            }
        }
    };

    JLightingManager.prototype.isLightEvent = function(event) {
        const hint = event.pages[0].list[0];
        return (hint !== null) && (hint.code === 108) && (hint.parameters[0].toLowerCase() === '!jpc_light');
    };

    JLightingManager.prototype.lightEventHandler = function(event) {
        const params = event.pages[0].list.clone();
        params.shift();  // remove "jpc_light"
        params.pop();    // remove end of statement
        let config = new JLightingObjectConfig();
        config.event_name = event.name;
        config.event_id = event.id;
        config.index = this.dispatchUniformIndex();
        const intepreter = new JLightingInterpreter(config);
        for (const param of params) {
            if (param.code == 108) { // make sure it is a comment
                const assign_statement = param.parameters[0];
                intepreter.interpret(assign_statement);
            }
        }
        // store the config
        this.objConfigsNameTable[event.name] = config;
        this.objConfigsIdTable[event.id] = config;
    };

    JLightingManager.prototype.dispatchUniformIndex = function() {
        const dispatched_index = this.dispatch_index;
        this.dispatch_index += 1;
        return dispatched_index;
    };

    JLightingManager.prototype.refreshUniforms = function(config) {
        if (config instanceof JLightingObjectConfig) {
            const i = config.index;
            // Update light source's position
            let dx = (config.x - this.playerSprite.position._x);
            let dy = (config.y - this.playerSprite.position._y);
            if (config.is_light_source === false) {
                this.filter.uniforms.positions[2 + 2 * i + 0] = 9999999.0;
                this.filter.uniforms.positions[2 + 2 * i + 1] = 9999999.0;
            } else {
                this.filter.uniforms.positions[2 + 2 * i + 0] = dx + this.playerSprite.position._x;
                this.filter.uniforms.positions[2 + 2 * i + 1] = dy + this.playerSprite.position._y;
            }
            // Update ambient color
            this.filter.uniforms.colors[3 + 3 * i + 0] = config.r;
            this.filter.uniforms.colors[3 + 3 * i + 1] = config.g;
            this.filter.uniforms.colors[3 + 3 * i + 2] = config.b;
            // Update pointlight radius
            this.filter.uniforms.pointRadius[1 + i] = config.pointlight_radius;
            // Update light type
            this.filter.uniforms.types[1 + i] = config.lighttype;
            // Update light direction
            this.filter.uniforms.directions[1 + i] = config.direction;
            // Update fov
            this.filter.uniforms.FOV[1 + i] = config.fov;
            // Update spotlightRadius for spotlight
            this.filter.uniforms.spotRadius[1 + i] = config.spotlight_radius;
            // Update uTime
            this.filter.uniforms.times[1 + i] += config.delta;
        } else if (config instanceof JLightingPlayerConfig) {
            // Update player's position
            this.filter.uniforms.positions[0] = config.x;
            this.filter.uniforms.positions[1] = config.y;
            // Update player's ambient color
            this.filter.uniforms.colors[0] = config.r;
            this.filter.uniforms.colors[1] = config.g;
            this.filter.uniforms.colors[2] = config.b;
            // Update player's light type
            this.filter.uniforms.types[0] = config.lighttype;
            // Update player's light radius
            this.filter.uniforms.pointRadius[0] = config.pointlight_radius;
            // Update player's direction
            this.filter.uniforms.directions[0] = $gamePlayer.direction();
            // Update player's FOV
            this.filter.uniforms.FOV[0] = config.fov;
            // Update player's spotlight radius
            this.filter.uniforms.spotRadius[0] = config.spotlight_radius;
            // Update player's uTime
            this.filter.uniforms.times[0] += config.delta;
        } else {
            JPC.core.logger.warn('Unidentified configuration.');
        }
    };

    JLightingManager.prototype.findPlayerSprite = function() {
        return SceneManager._scene._spriteset._characterSprites.find(
            character => character._character instanceof Game_Player);
    };

    JLightingManager.prototype.update = function() {
        this.initialize();
        if (this.filter.enabled === true) {
            this.updatePlayer();
            this.updateLightEventPosition();
            this.updateLightEvent();
            this.updateGlobalIllumination();
        }
        this.updateEnableFilter();
    };

    JLightingManager.prototype.updatePlayer = function() {
        if (this.playerConfig.is_light_source === true) {
            this.playerConfig.x = this.playerSprite.position._x;
            this.playerConfig.y = this.playerSprite.position._y;
        } else {
            this.playerConfig.x = 9999999.0;
            this.playerConfig.y = 9999999.0;
        }
        this.refreshUniforms(this.playerConfig);
    };

    JLightingManager.prototype.updateLightEvent = function() {
        for (const name in this.objConfigsNameTable) {
            const config = this.objConfigsNameTable[name];
            this.refreshUniforms(config);
        }
    };

    JLightingManager.prototype.updateGlobalIllumination = function() {
        this.filter.uniforms.globalIllumination = this.mapConfig.global_illumination;
        this.filter.enabled = this.mapConfig.enable;
    };

    JLightingManager.prototype.updateEnableFilter = function() {
        this.filter.enabled = this.mapConfig.enable;
    };

    ////////////////////////////////////////////
    /////               Hook               /////
    ////////////////////////////////////////////

    const _Spriteset_Map__initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map__initialize.apply(this, arguments);
        this.lighting_manager = new JLightingManager();
        JPC.lighting.manager = this.lighting_manager;
        this.filters.push(this.lighting_manager.filter);
    };

    const _Spriteset_Map__update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map__update.apply(this, arguments);
        this.lighting_manager.update();
    };

    // Loading plugin is complete.
    JPC.core.logger.debug(`${pluginName} is ready.`);
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
