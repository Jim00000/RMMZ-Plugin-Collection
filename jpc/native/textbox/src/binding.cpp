#include <napi.h>
#include <windows.h>
#include "textbox.h"

namespace {

    const std::wstring utf8ToWchar(const std::string& utf8) 
    {
        std::wstring wchar(utf8.size(), 0);
        MultiByteToWideChar(CP_UTF8, 0, utf8.c_str(), utf8.size(), const_cast<LPWSTR>(wchar.c_str()), wchar.size());
        return wchar;
    }

    const std::string wcharToUtf8(const std::wstring wstr) 
    {
        const int needed_sz = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), wstr.size(), NULL, 0, NULL, NULL);
        std::string utf8(needed_sz, 0);
        WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), wstr.size(), const_cast<LPSTR>(utf8.c_str()), utf8.size(), NULL, NULL);
        return utf8;
    }

    Napi::String registerOpenTextBox(const Napi::CallbackInfo& info)
    {
        Napi::Env env = info.Env();
        std::wstring wOutputText;
        const uint32_t win_x = info[0].As<Napi::Number>().Int32Value();
        const uint32_t win_y = info[1].As<Napi::Number>().Int32Value();
        const uint32_t width = info[2].As<Napi::Number>().Int32Value();
        const uint32_t height = info[3].As<Napi::Number>().Int32Value();
        const std::string utf8_title = info[4].As<Napi::String>().Utf8Value();
        JPC::TextBox::open(utf8ToWchar(utf8_title).c_str(), wOutputText, win_x, win_y, width, height);
        return Napi::String::New(env, wcharToUtf8(wOutputText));
    }

    Napi::Object Init(Napi::Env env, Napi::Object exports)
    {
        exports.Set(Napi::String::New(env, "openTextBox"), Napi::Function::New(env, registerOpenTextBox));
        return exports;
    }
}

NODE_API_MODULE(textbox, Init);

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

*/