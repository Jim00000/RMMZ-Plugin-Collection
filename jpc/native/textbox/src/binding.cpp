#include <napi.h>
#include <windows.h>
#include "textbox.h"

namespace {

    Napi::String registerOpenTextBox(const Napi::CallbackInfo& info)
    {
        Napi::Env env = info.Env();
        std::wstring text, title;
        const uint32_t win_x = info[0].As<Napi::Number>().Int32Value();
        const uint32_t win_y = info[1].As<Napi::Number>().Int32Value();
        const uint32_t width = info[2].As<Napi::Number>().Int32Value();
        const uint32_t height = info[3].As<Napi::Number>().Int32Value();
        const std::string utf8_title = info[4].As<Napi::String>().Utf8Value();
        title.resize(utf8_title.size());
        MultiByteToWideChar(CP_UTF8, 0, utf8_title.c_str(), utf8_title.size(), (LPWSTR)title.c_str(), title.size());
        JPC::TextBox::open(title.c_str(), text, win_x, win_y, width, height);
        const int needed_sz = WideCharToMultiByte(CP_UTF8, 0, text.c_str(), text.size(), NULL, 0, NULL, NULL);
        std::string utf8_text(needed_sz, 0);
        WideCharToMultiByte(CP_UTF8, 0, text.c_str(), text.size(), (LPSTR)utf8_text.c_str(), utf8_text.size(), NULL, NULL);
        return Napi::String::New(env, utf8_text);
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