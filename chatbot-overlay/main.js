const { app, BrowserWindow, globalShortcut, screen } = require("electron");

let win;
let resizeTimeout;

function resizeToContent() {
  if (!win || win.isDestroyed()) return;
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    win.webContents.executeJavaScript(`
      new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              const views = ['#icon-view', '#chat-view', '#expanded-view'];
              let visibleElement = null;
              
              for (const selector of views) {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                  visibleElement = element;
                  break;
                }
              }
              
              if (visibleElement) {
                const rect = visibleElement.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(visibleElement);
                
                const marginTop = parseInt(computedStyle.marginTop) || 0;
                const marginBottom = parseInt(computedStyle.marginBottom) || 0;
                const marginLeft = parseInt(computedStyle.marginLeft) || 0;
                const marginRight = parseInt(computedStyle.marginRight) || 0;
                
                resolve({
                  width: Math.ceil(rect.width + marginLeft + marginRight),
                  height: Math.ceil(rect.height + marginTop + marginBottom),
                  selector: visibleElement.id
                });
              } else {
                resolve({ width: 80, height: 80, selector: 'fallback' });
              }
            } catch (error) {
              console.error('Error measuring element:', error);
              resolve({ width: 80, height: 80, selector: 'error' });
            }
          });
        });
      });
    `).then(bounds => {
      if (bounds && !win.isDestroyed()) {
        const { width, height, selector } = bounds;
        console.log(`Resizing for ${selector}: ${width}x${height}`);
        
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workArea;

        const x = screenWidth - width - 24;
        const y = screenHeight - height - 24;

        const finalWidth = Math.max(width, 64);
        const finalHeight = Math.max(height, 64);

        win.setBounds({ 
          x: Math.max(0, x), 
          y: Math.max(0, y), 
          width: finalWidth, 
          height: finalHeight 
        });
      }
    }).catch(err => {
      console.error("Failed to resize:", err);
    });
  }, 100);
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 80,
    height: 80,
    frame: false,
    alwaysOnTop: true,
    transparent: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    show: false
  });

  win.loadURL("http://localhost:3000");

  win.webContents.once('did-finish-load', () => {
    console.log("Window loaded, showing and resizing");
    win.show();
    resizeToContent();
  });

  win.webContents.on('console-message', (event, level, message) => {
    if (message.includes('electron-resize')) {
      console.log("Resize event received");
      resizeToContent();
    }
  });

  win.webContents.executeJavaScript(`
    window.addEventListener('electron-resize', () => {
      console.log('electron-resize event triggered');
    });
    
    const observer = new MutationObserver(() => {
      window.dispatchEvent(new Event('electron-resize'));
    });
    
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    });
  `);

  globalShortcut.register("CommandOrControl+O", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      resizeToContent();
    }
  });

  win.on('show', () => {
    setTimeout(resizeToContent, 200);
  });

  win.on('closed', () => {
    win = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    globalShortcut.unregisterAll();
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});