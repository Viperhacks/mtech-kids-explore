[Setup]
AppName=MtechAcademyApp
AppVersion=1.0
DefaultDirName={pf}\MtechAcademyApp
DefaultGroupName=MtechAcademyApp
OutputDir=C:\Users\user\Desktop\Setup
OutputBaseFilename=MtechAcademyAppSetup
SetupIconFile=C:\mtech-kids-explore\mtech.ico
Compression=lzma2
LZMAUseSeparateProcess=yes
SolidCompression=yes

[Files]
Source: "C:\mtech-kids-explore\dist\win-unpacked\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\MtechAcademyApp"; Filename: "{app}\MtechAcademyApp.exe"
Name: "{commondesktop}\MtechAcademyApp"; Filename: "{app}\MtechAcademyApp.exe"; Tasks: desktopicon
Name: "{group}\Uninstall MtechAcademyApp"; Filename: "{uninstallexe}"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"; Flags: unchecked

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
