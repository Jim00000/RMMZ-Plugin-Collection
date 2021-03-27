{
    "targets": [
        {
            "target_name": "textbox",
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "sources": [
                "src/textbox.cpp",
                "src/binding.cpp"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS'],
        }
    ]
}
