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
            # Hint: monitor textbox.vcxproj and see what changes
            'configurations': {
                # 'Debug': {
                #     'msvs_settings': {
                #         'VCCLCompilerTool': {}
                #     },
                #     "msbuild_settings": {
                #         "ClCompile": {
                #             "LanguageStandard": "stdcpplatest",
                #             "AdditionalOptions": "/utf-8 %(AdditionalOptions)"
                #         }
                #     }
                # },
                'Release': {
                    'msvs_settings': {
                        'VCCLCompilerTool': {}
                    },
                    "msbuild_settings": {
                        "ClCompile": {
                            "LanguageStandard": "stdcpplatest",
                            "Optimization": "Full",
                            "FavorSizeOrSpeed": "Speed",
                            "AdditionalOptions": "/utf-8 %(AdditionalOptions)"
                        }
                    }
                }
            }
        }
    ]
}
