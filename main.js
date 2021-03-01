// Modules to control application life and create native browser window
const {app, BrowserWindow, nativeTheme} = require('electron')
const path = require('path')

if (process.mas) app.setName('AI Studio')

let mainWindow = null

function createWindow () {
  const windowOptions = {
    width: 1080,
    minWidth: 680,
    height: 840,
    title: app.getName(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  }

  windowOptions.icon = path.join(__dirname, '/assets/app-icon/app.ico')

  // Create the browser window.
  mainWindow = new BrowserWindow(windowOptions)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// set theme
nativeTheme.themeSource = 'dark'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

require(path.join(__dirname, '/main-process/open-file.js'))
