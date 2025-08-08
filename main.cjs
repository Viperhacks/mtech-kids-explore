const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, screen, ipcMain } = require('electron');

const isDev = process.env.ELECTRON_IS_DEV === 'true' || !app.isPackaged;

function loadConfig() {
  const configPath = app.isPackaged
    ? path.join(process.resourcesPath, 'config.json')
    : path.join(__dirname, 'config.json');

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load config.json:', err);
    return {
      apiBaseUrl: 'http://localhost:8080/api' // fallback
    };
  }
}

function createWindow() {
  const config = loadConfig();
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.handle('get-config', () => config);
  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:8081');
    win.webContents.openDevTools();
  } else {
    // Construct the absolute path to your index.html in the unpacked folder
    const indexPath = path.resolve(
      process.resourcesPath,
      'app.asar.unpacked',
      'dist',
      'index.html'
    );

    // Load it with loadFile to avoid file URL issues
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load local index.html:', err);
    });
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
