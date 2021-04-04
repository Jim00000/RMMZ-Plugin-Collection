#include <Windows.h>
#include <thread>
#include "textbox.h"

#define BTN_OK 1000
#define BTN_CLEAR 1001

#pragma comment(linker, "\"/manifestdependency:type='win32' \
name='Microsoft.Windows.Common-Controls' version='6.0.0.0' \
processorArchitecture='*' publicKeyToken='6595b64144ccf1df' language='*'\"")

namespace {

    WCHAR INPUT_BUFFER[BUFSIZ];

    LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
    VOID forceForegroundWindow(HWND hWnd);

    HRESULT __impl_open(CONST LPCWSTR CLASS_NAME, CONST LPCWSTR WINDOW_TITLE, std::wstring& text, 
        CONST UINT X, CONST UINT Y, CONST UINT WIDTH, CONST UINT HEIGHT)
    {
        CONST HINSTANCE hInstance = GetModuleHandleW(NULL);
        CONST UINT nCmdShow = 1;

        // Register the window class.
        WNDCLASSEXW wcex = { };
        wcex.cbSize = sizeof(WNDCLASSEX);
        wcex.style = CS_HREDRAW | CS_VREDRAW;
        wcex.lpfnWndProc = WindowProc;
        wcex.cbClsExtra = 0;
        wcex.cbWndExtra = 0;
        wcex.hInstance = hInstance;
        wcex.hIcon = LoadIcon(hInstance, IDI_APPLICATION);
        wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
        wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
        wcex.lpszMenuName = NULL;
        wcex.lpszClassName = CLASS_NAME;
        wcex.hIconSm = LoadIcon(wcex.hInstance, IDI_APPLICATION);

        if (!RegisterClassExW(&wcex))
        {
            MessageBoxW(
                NULL,
                L"Call to RegisterClassEx failed!",
                L"Error",
                MB_OK);

            return E_FAIL;
        }

        // Create the window
        HWND hWnd = CreateWindowExW(
            0,
            CLASS_NAME,                                 // Window class
            WINDOW_TITLE,                               // Window text
            WS_SYSMENU,                                 // Window style
            X + WIDTH / 2 - 200, Y + HEIGHT / 2 - 35,   // Position
            400, 70,                                    // Size
            NULL,                                       // Parent window    
            NULL,                                       // Menu
            hInstance,                                  // Instance handle
            NULL                                        // Additional application data
        );

        if (hWnd == NULL)
        {
            return E_FAIL;
        }

        // hWnd[0]
        HWND hEditBox = CreateWindowW(
            L"EDIT",
            NULL,
            WS_CHILD | WS_VISIBLE | WS_BORDER | ES_MULTILINE | ES_LEFT | ES_AUTOVSCROLL,
            10, 10, 250, 20,
            hWnd, NULL, NULL, NULL);

        if (hEditBox == NULL)
        {
            return E_FAIL;
        }

        // hWnd[1]
        HWND hOkBtn = CreateWindowExW(
            0,
            L"BUTTON",
            L"OK",
            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON | BS_FLAT,
            270, 10, 50, 20,
            hWnd,
            (HMENU)BTN_OK,
            (HINSTANCE)GetWindowLongPtrW(hWnd, GWLP_HINSTANCE), NULL);

        if (hOkBtn == NULL)
        {
            return E_FAIL;
        }

        // hWnd[2]
        HWND hClearBtn = CreateWindowExW(
            0,
            L"BUTTON",
            L"Clear",
            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON | BS_FLAT,
            330, 10, 50, 20,
            hWnd,
            (HMENU)BTN_CLEAR,
            (HINSTANCE)GetWindowLongPtrW(hWnd, GWLP_HINSTANCE), NULL);

        if (hClearBtn == NULL)
        {
            return E_FAIL;
        }

        // Set fonts
        LOGFONTW logfont;
        ZeroMemory(&logfont, sizeof(LOGFONTW));
        logfont.lfCharSet = DEFAULT_CHARSET;
        logfont.lfHeight = 14;
        const CHAR FONTS[] = "Courier New";
        RtlCopyMemory(logfont.lfFaceName, FONTS, sizeof(FONTS));
        HFONT hFont = CreateFontIndirectW(&logfont);
        SendMessageW(hOkBtn, WM_SETFONT, (WPARAM)hFont, TRUE);
        SendMessageW(hClearBtn, WM_SETFONT, (WPARAM)hFont, TRUE);
        SendMessageW(hEditBox, WM_SETFONT, (WPARAM)hFont, TRUE);

        forceForegroundWindow(hWnd);
        ShowWindow(hWnd, nCmdShow);
        UpdateWindow(hWnd);

        // Run the message loop.
        MSG msg = { };
        while (GetMessageW(&msg, NULL, 0, 0))
        {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }

        text = std::wstring{ INPUT_BUFFER };

        if (!UnregisterClassW(CLASS_NAME, hInstance)) 
        {
            MessageBoxW(
                NULL,
                L"Call to UnregisterClass failed!",
                L"Error",
                MB_OK);

            return E_FAIL;
        }

        return S_OK;
    }

    LRESULT CALLBACK WindowProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
    {
        switch (uMsg)
        {
        case WM_DESTROY:
            PostQuitMessage(0);
            break;

        case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            // TODO: Add any drawing code that uses hdc here...
            EndPaint(hWnd, &ps);
        }
        break;

        case WM_COMMAND:
        {
            INT wmId = LOWORD(wParam);
            switch (wmId)
            {
            case BTN_OK:
            {
                HWND hEditBox = GetWindow(hWnd, GW_CHILD);
                GetWindowTextW(hEditBox, INPUT_BUFFER, BUFSIZ);
                PostMessageW(hWnd, WM_CLOSE, 0, 0);
            }
            break;

            case BTN_CLEAR:
            {
                ZeroMemory(INPUT_BUFFER, BUFSIZ);
                HWND hEditBox = GetWindow(hWnd, GW_CHILD);
                SetWindowTextW(hEditBox, INPUT_BUFFER);
            }
            break;

            default:
                return DefWindowProcW(hWnd, uMsg, wParam, lParam);
            }
        }
        break;

        default:
            return DefWindowProcW(hWnd, uMsg, wParam, lParam);
        }
        return S_NORMAL;
    }

    VOID forceForegroundWindow(HWND hWnd) {
        DWORD dwCurrentThread = GetCurrentThreadId();
        DWORD dwFGThread = GetWindowThreadProcessId(GetForegroundWindow(), NULL);
        AttachThreadInput(dwCurrentThread, dwFGThread, TRUE);

        SetForegroundWindow(hWnd);
        //SetCapture(hWnd);
        //SetFocus(hWnd);
        //SetActiveWindow(hWnd);
        //EnableWindow(hWnd, TRUE);

        AttachThreadInput(dwCurrentThread, dwFGThread, FALSE);
    }
}

void JPC::TextBox::open(const wchar_t* window_title, std::wstring& text, 
    uint32_t win_x, uint32_t win_y, 
    uint32_t width, uint32_t height)
{
    // blocking game process
    __impl_open(L"Win32 Text Box Class", window_title, text, win_x, win_y, width, height);
    // non-blocking game process
    //std::thread(__impl_open).detach();
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