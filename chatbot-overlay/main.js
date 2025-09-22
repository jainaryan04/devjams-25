const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require("electron");
const path = require("path");

let win;

ipcMain.on("electron-resize", (event, { width, height }) => {
  console.log('Received resize request:', { width, height });
  if (!win || win.isDestroyed()) return;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;

  const fixedHeight = 500;
  const x = screenWidth - width - 24;
  const y = screenHeight - fixedHeight - 24;

  win.setBounds({
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.max(width, 64),
    height: fixedHeight,
  });
});

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });  

  win.loadURL("http://localhost:3000");

  win.webContents.once("did-finish-load", () => {
    win.show();
  });

  globalShortcut.register("CommandOrControl+O", () => {
    if (win.isVisible()) win.hide();
    else win.show();
  });

  win.on("closed", () => (win = null));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    globalShortcut.unregisterAll();
    app.quit();
  }
});

app.on("will-quit", () => globalShortcut.unregisterAll());

app.on("activate", () => {
  if (win === null) createWindow();
});
