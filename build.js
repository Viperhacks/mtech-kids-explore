const builder = require('electron-builder');
const fs = require('fs');

builder.build({
  targets: builder.Platform.WINDOWS.createTarget(),
  config: {
    win: {
      target: {
        target: 'portable',
        arch: ['x64']
      }
    }
  }
}).then(() => {
  console.log('Build successful!');
  const portablePath = 'dist/MtechKidsExplore-0.0.1-win-x64.exe';
  if (fs.existsSync(portablePath)) {
    fs.renameSync(portablePath, 'dist/MtechKidsExplore-Setup-0.0.1.exe');
  }
}).catch(console.error);