# TextBox Native node

This program provides users a convenient way to make input from the keyboard.

## Limitation

- This program supports Windows platform only (Web is not included).
- Make sure NW.js is available and accessible in the environment.

## User guide

You can visit and view [Wiki:How to use and run C/C++ code in RPG Maker MZ ?](https://github.com/Jim00000/RMMZ-Plugin-Collection/wiki/How-to-use-and-run-C-or-Cpp-code-in-RPG-Maker-MZ-%3F) to build the program.

Assume that corescript v1.1.1 is used.

At first, make sure necessary tools, modules and libraries are ready (npm, python, and others).

Next, navigate to this folder and input :

```
$ npm install node-api node-addon-api
```

And make config :

```
$ nw-gyp configure --target=0.44.5
```

Navigate to the build until build folder is generated.

Open textbox.vcxproj with Visual Studio 2019 and build the native node.

## Batch script

For convenience, a script to config and build the addon is provided. Just run the script to build
the textbox module and copied to `addons` folder.