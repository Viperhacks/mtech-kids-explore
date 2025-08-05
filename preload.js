const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  appName: 'Mtech Academy',
  getConfig: async () => {
    return await ipcRenderer.invoke('get-config');
  }
});
