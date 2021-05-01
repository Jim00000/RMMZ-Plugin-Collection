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

// Virtual key codes (Partial)
// This follows virtual-key codes in Windows develop center
// https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes

const vkeys = {
    VK_LBUTTON: 0x01,    // Left mouse button
    VK_RBUTTON: 0x02,    // Right mouse button
    VK_CANCEL: 0x03,     //
    VK_MBUTTON: 0x04,    // Middle mouse button
    VK_XBUTTON1: 0x05,   // X1 mouse button
    VK_XBUTTON2: 0x06,   // X2 mouse button
    VK_BACK: 0x08,       // BACKSPACE
    VK_TAB: 0x09,        //
    VK_CLEAR: 0x0C,      //
    VK_RETURN: 0x0D,     // ENTER
    VK_SHIFT: 0x10,      //
    VK_CONTROL: 0x11,    //
    VK_MENU: 0x12,       // ALT
    VK_PAUSE: 0x13,      //
    VK_CAPITAL: 0x14,    // CAPS LOCK
    VK_ESCAPE: 0x1B,     //
    VK_SPACE: 0x20,      //
    VK_PRIOR: 0x21,      // PAGE UP
    VK_NEXT: 0x22,       // PAGE DOWN
    VK_END: 0x23,        //
    VK_LEFT: 0x25,       //
    VK_UP: 0x26,         //
    VK_RIGHT: 0x27,      //
    VK_DOWN: 0x28,       //
    VK_PRINT: 0x2A,      //
    VK_SNAPSHOT: 0x2C,   // PRINT SCREEN
    VK_INSERT: 0x2D,     //
    VK_DELETE: 0x2E,     //
    VK_HELP: 0x2F,       //
    VK_0: 0x30,          //
    VK_1: 0x31,          //
    VK_2: 0x32,          //
    VK_3: 0x33,          //
    VK_4: 0x34,          //
    VK_5: 0x35,          //
    VK_6: 0x36,          //
    VK_7: 0x37,          //
    VK_8: 0x38,          //
    VK_9: 0x39,          //
    VK_A: 0x41,          //
    VK_B: 0x42,          //
    VK_C: 0x43,          //
    VK_D: 0x44,          //
    VK_E: 0x45,          //
    VK_F: 0x46,          //
    VK_G: 0x47,          //
    VK_H: 0x48,          //
    VK_I: 0x49,          //
    VK_J: 0x4A,          //
    VK_K: 0x4B,          //
    VK_L: 0x4C,          //
    VK_M: 0x4D,          //
    VK_N: 0x4E,          //
    VK_O: 0x4F,          //
    VK_P: 0x50,          //
    VK_Q: 0x51,          //
    VK_R: 0x52,          //
    VK_S: 0x53,          //
    VK_T: 0x54,          //
    VK_U: 0x55,          //
    VK_V: 0x56,          //
    VK_W: 0x57,          //
    VK_X: 0x58,          //
    VK_Y: 0x59,          //
    VK_Z: 0x5A,          //
    VK_LWIN: 0x5B,       // LEFT WIN
    VK_RWIN: 0x5C,       // RIGHT WIN
    VK_SLEEP: 0x5F,      //
    VK_NUMPAD0: 0x60,    //
    VK_NUMPAD1: 0x61,    //
    VK_NUMPAD2: 0x62,    //
    VK_NUMPAD3: 0x63,    //
    VK_NUMPAD4: 0x64,    //
    VK_NUMPAD5: 0x65,    //
    VK_NUMPAD6: 0x66,    //
    VK_NUMPAD7: 0x67,    //
    VK_NUMPAD8: 0x68,    //
    VK_NUMPAD9: 0x69,    //
    VK_MULTIPLY: 0x6A,   //
    VK_ADD: 0x6B,        //
    VK_SEPARATOR: 0x6C,  //
    VK_SUBTRACT: 0x6D,   //
    VK_DECIMAL: 0x6E,    //
    VK_DIVIDE: 0x6F,     //
    VK_F1: 0x70,         //
    VK_F2: 0x71,         //
    VK_F3: 0x72,         //
    VK_F4: 0x73,         //
    VK_F5: 0x74,         //
    VK_F6: 0x75,         //
    VK_F7: 0x76,         //
    VK_F8: 0x77,         //
    VK_F9: 0x78,         //
    VK_F10: 0x79,        //
    VK_F11: 0x7A,        //
    VK_F12: 0x7B,        //
    VK_NUMLOCK: 0x90,    //
    VK_SCROLL: 0x91,     // SCROLL LOCK
    VK_LSHIFT: 0xA0,     //
    VK_RSHIFT: 0xA1,     //
    VK_LCONTROL: 0xA2,   //
    VK_RCONTROL: 0xA3,   //
    VK_LMENU: 0xA4,      // Left MENU key
    VK_RMENU: 0xA5       // Right MENU key
};

export default vkeys;