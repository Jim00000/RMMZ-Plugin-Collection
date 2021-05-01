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

export const __core = {};

// Handle logger
import * as log_module from './third_party/logger.js';
__core.log = log_module.__logger;

// Handle user input
import * as input_module from './input.js';
__core.input = input_module.__input;

// Handle GLSL
import * as glsl_module from './glsl.js';
__core.glsl = glsl_module.__glsl;

// Handle misc
import * as misc_module from './miscellany.js';
__core.misc = misc_module.__miscellany;

// Handle notifier
import * as notify_module from './notifier.js';
__core.notifier = notify_module.__notifier;

// Handle type conversion
import * as type_module from './typeconverter.js';
__core.type = type_module.__typeconverter;

// Handle XML parsing
import * as xml_module from './xmlparser.js';
__core.xml = xml_module.__xmlparser;