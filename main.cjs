const path = require('path');
const { app, BrowserWindow } = require('electron');

const isDev = process.env.ELECTRON_IS_DEV === 'true' || !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Optional but recommended
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:8081');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  win.webContents.on('did-fail-load', (event, code, desc, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${desc} (${code})`);
    if (isDev) {
      setTimeout(() => win.loadURL('http://localhost:8081'), 1000);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
