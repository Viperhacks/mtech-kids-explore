@echo off
echo Adding exclusion paths to Windows Defender...

powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\user\AppData\Local\electron-builder\Cache\'"
powershell -Command "Add-MpPreference -ExclusionPath 'C:\mtech-kids-explore\'"

echo Done. Now go run the build in PowerShell as admin.
pause
