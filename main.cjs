const path = require('path');
const { app, BrowserWindow, screen } = require('electron');

const isDev = process.env.ELECTRON_IS_DEV === 'true' || !app.isPackaged;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Kill the menu bar, Blexta-style
  win.setMenuBarVisibility(false); // or win.removeMenu() if you wanna go nuclear

  if (isDev) {
  win.loadURL('http://localhost:8081');
  win.webContents.openDevTools();
} else {
  win.loadFile(path.join(__dirname, 'index.html'));

  win.webContents.openDevTools(); // Force open devtools in production build
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
