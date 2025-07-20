const { contextBridge, app } = require('electron');
const fs = require('fs');
const path = require('path');

let config = {
  apiBaseUrl: 'http://localhost:8080/api' // fallback default
};

try {
  // Use different config path based on dev or prod
  const configPath = app.isPackaged
    ? path.join(process.resourcesPath, 'config.json') // production: next to exe in resources
    : path.join(__dirname, 'config.json');             // dev: alongside preload.js

  const raw = fs.readFileSync(configPath);
  config = JSON.parse(raw);
} catch (err) {
  console.error('Failed to load config.json:', err);
}

contextBridge.exposeInMainWorld('electron', {
  appName: 'Mtech Academy',
  config
});
