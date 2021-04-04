@set solutionFile=".\build\binding.sln"
@set vswhere="C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe"
@set exeName="MSBuild.exe"
@set config="Release"
@set msBuildFlag=/p:Configuration=%config:"=% /p:Platform="x64" -noLogo

@REM Configuration
@call npm config set msvs_version 2019
@call npm install node-api@0.0.1 node-addon-api@3.1.0
@call nw-gyp configure --target=0.44.5

@REM Find MSBuild
@for /f "tokens=*" %%i in (
        '@call %vswhere% -property installationPath'
    ) do @set msBuild="%%i\MsBuild\Current\Bin\%exeName:"=%"

@REM Build 
@call %msBuild% %solutionFile% %msBuildFlag%

@REM Copy to addons folder
@call copy ".\build\%config:"=%\textbox.node" "..\addons\"

@pause