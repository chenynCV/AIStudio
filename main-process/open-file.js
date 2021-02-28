const { ipcMain } = require('electron')


ipcMain.on('open-file-dialog', (event) => {
    event.sender.send('file-received')
});

