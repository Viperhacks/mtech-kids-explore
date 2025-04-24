const path = require('path');
const { app, BrowserWindow } = require('electron');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:8081');
    win.webContents.openDevTools(); // Optional: for debugging
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
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
