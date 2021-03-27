#pragma once

#include <string>

namespace JPC {
    namespace TextBox {
        void open(const wchar_t* window_title, std::wstring& text, 
            const uint32_t win_x, const uint32_t win_y, 
            const uint32_t width, const uint32_t height);
    }
}

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