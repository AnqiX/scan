if "%PROCESSOR_ARCHITECTURE%"=="x86" goto x86
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" goto x64
exit

:x64
regsvr32 /u "%~d0%~p0DynamsoftBarcodeReaderCtrlx64.dll"
regsvr32 /u "%~d0%~p0DynamsoftBarcodeReaderCtrlx86.dll"
exit

:x86
regsvr32 /u "%~d0%~p0DynamsoftBarcodeReaderCtrlx86.dll"