@echo off
setlocal enabledelayedexpansion

set INSTALL_PATH=C:\\js-micro
set SERVICE_NAME=test.ncc
set CMD= 

:: 构建执行文件
echo build %SERVICE_NAME%
call node build

:: 执行命令
if "%1"=="install" (
    set CMD=install
)
if "%1"=="up" (
    set CMD=install
)
if "%1"=="release" (
    set CMD=release
)
if "%CMD%"=="release" (
    echo mkdir %INSTALL_PATH%
    mkdir "%INSTALL_PATH%"
    echo copy %SERVICE_NAME% %INSTALL_PATH%
    copy /y "%SERVICE_NAME%" "%INSTALL_PATH%"
)
if "%CMD%"=="install" (
    echo mkdir %INSTALL_PATH%
    mkdir "%INSTALL_PATH%"
    echo copy %SERVICE_NAME% %INSTALL_PATH%
    copy /y "%SERVICE_NAME%" "%INSTALL_PATH%"
    set FOUND_OLD_PROCESS=false
    for /f "tokens=1,2,3,4 delims=," %%i in ('wmic process where "name='node.exe'" get Name^,ProcessId^,CommandLine /format:csv ^| find "%INSTALL_PATH%\%SERVICE_NAME%"') do (
        echo %%l
        set OLD_PID=%%l
        echo kill !OLD_PID!
        taskkill /f /pid !OLD_PID!
        echo start %SERVICE_NAME%
        copy /y "%SERVICE_NAME%" "%INSTALL_PATH%"
        start "" powershell -Command "Start-Process -FilePath 'node' -ArgumentList '%INSTALL_PATH%\%SERVICE_NAME%' -WindowStyle Hidden"
        set FOUND_OLD_PROCESS=true
    )
    if !FOUND_OLD_PROCESS! == false (
        echo start %SERVICE_NAME%
        start "" powershell -Command "Start-Process -FilePath 'node' -ArgumentList '%INSTALL_PATH%\%SERVICE_NAME%' -WindowStyle Hidden"
    )
)
endlocal
