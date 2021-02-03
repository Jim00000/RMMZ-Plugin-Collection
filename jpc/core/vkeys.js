// Virtual key codes (Partial)
// This follows virtual-key codes in Windows develop center
// https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
export const __vkeys = (() => {
    'use strict';
    var VK = {};
    VK.VK_LBUTTON = 0x01;    // Left mouse button
    VK.VK_RBUTTON = 0x02;    // Right mouse button
    VK.VK_CANCEL = 0x03;     //
    VK.VK_MBUTTON = 0x04;    // Middle mouse button
    VK.VK_XBUTTON1 = 0x05;   // X1 mouse button
    VK.VK_XBUTTON2 = 0x06;   // X2 mouse button
    VK.VK_BACK = 0x08;       // BACKSPACE
    VK.VK_TAB = 0x09;        //
    VK.VK_CLEAR = 0x0C;      //
    VK.VK_RETURN = 0x0D;     // ENTER
    VK.VK_SHIFT = 0x10;      //
    VK.VK_CONTROL = 0x11;    //
    VK.VK_MENU = 0x12;       // ALT
    VK.VK_PAUSE = 0x13;      //
    VK.VK_CAPITAL = 0x14;    // CAPS LOCK
    VK.VK_ESCAPE = 0x1B;     //
    VK.VK_SPACE = 0x20;      //
    VK.VK_PRIOR = 0x21;      // PAGE UP
    VK.VK_NEXT = 0x22;       // PAGE DOWN
    VK.VK_END = 0x23;        //
    VK.VK_LEFT = 0x25;       //
    VK.VK_UP = 0x26;         //
    VK.VK_RIGHT = 0x27;      //
    VK.VK_DOWN = 0x28;       //
    VK.VK_PRINT = 0x2A;      //
    VK.VK_SNAPSHOT = 0x2C;   // PRINT SCREEN
    VK.VK_INSERT = 0x2D;     //
    VK.VK_DELETE = 0x2E;     //
    VK.VK_HELP = 0x2F;       //
    VK.VK_0 = 0x30;          //
    VK.VK_1 = 0x31;          //
    VK.VK_2 = 0x32;          //
    VK.VK_3 = 0x33;          //
    VK.VK_4 = 0x34;          //
    VK.VK_5 = 0x35;          //
    VK.VK_6 = 0x36;          //
    VK.VK_7 = 0x37;          //
    VK.VK_8 = 0x38;          //
    VK.VK_9 = 0x39;          //
    VK.VK_A = 0x41;          //
    VK.VK_B = 0x42;          //
    VK.VK_C = 0x43;          //
    VK.VK_D = 0x44;          //
    VK.VK_E = 0x45;          //
    VK.VK_F = 0x46;          //
    VK.VK_G = 0x47;          //
    VK.VK_H = 0x48;          //
    VK.VK_I = 0x49;          //
    VK.VK_J = 0x4A;          //
    VK.VK_K = 0x4B;          //
    VK.VK_L = 0x4C;          //
    VK.VK_M = 0x4D;          //
    VK.VK_N = 0x4E;          //
    VK.VK_O = 0x4F;          //
    VK.VK_P = 0x50;          //
    VK.VK_Q = 0x51;          //
    VK.VK_R = 0x52;          //
    VK.VK_S = 0x53;          //
    VK.VK_T = 0x54;          //
    VK.VK_U = 0x55;          //
    VK.VK_V = 0x56;          //
    VK.VK_W = 0x57;          //
    VK.VK_X = 0x58;          //
    VK.VK_Y = 0x59;          //
    VK.VK_Z = 0x5A;          //
    VK.VK_LWIN = 0x5B;       // LEFT WIN
    VK.VK_RWIN = 0x5C;       // RIGHT WIN
    VK.VK_SLEEP = 0x5F;      //
    VK.VK_NUMPAD0 = 0x60;    //
    VK.VK_NUMPAD1 = 0x61;    //
    VK.VK_NUMPAD2 = 0x62;    //
    VK.VK_NUMPAD3 = 0x63;    //
    VK.VK_NUMPAD4 = 0x64;    //
    VK.VK_NUMPAD5 = 0x65;    //
    VK.VK_NUMPAD6 = 0x66;    //
    VK.VK_NUMPAD7 = 0x67;    //
    VK.VK_NUMPAD8 = 0x68;    //
    VK.VK_NUMPAD9 = 0x69;    //
    VK.VK_MULTIPLY = 0x6A;   //
    VK.VK_ADD = 0x6B;        //
    VK.VK_SEPARATOR = 0x6C;  //
    VK.VK_SUBTRACT = 0x6D;   //
    VK.VK_DECIMAL = 0x6E;    //
    VK.VK_DIVIDE = 0x6F;     //
    VK.VK_F1 = 0x70;         //
    VK.VK_F2 = 0x71;         //
    VK.VK_F3 = 0x72;         //
    VK.VK_F4 = 0x73;         //
    VK.VK_F5 = 0x74;         //
    VK.VK_F6 = 0x75;         //
    VK.VK_F7 = 0x76;         //
    VK.VK_F8 = 0x77;         //
    VK.VK_F9 = 0x78;         //
    VK.VK_F10 = 0x79;        //
    VK.VK_F11 = 0x7A;        //
    VK.VK_F12 = 0x7B;        //
    VK.VK_NUMLOCK = 0x90;    //
    VK.VK_SCROLL = 0x91;     // SCROLL LOCK
    VK.VK_LSHIFT = 0xA0;     //
    VK.VK_RSHIFT = 0xA1;     //
    VK.VK_LCONTROL = 0xA2;   //
    VK.VK_RCONTROL = 0xA3;   //
    VK.VK_LMENU = 0xA4;      // Left MENU key
    VK.VK_RMENU = 0xA5;      // Right MENU key
    
    return VK;
})();

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