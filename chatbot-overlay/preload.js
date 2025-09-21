const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendResize: (bounds) => ipcRenderer.send("electron-resize", bounds),
});
