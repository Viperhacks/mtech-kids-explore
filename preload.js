const { contextBridge } = require('electron');

// Expose only what you need to the renderer
contextBridge.exposeInMainWorld('electron', {
  appName: 'Mtech Academy'
});
