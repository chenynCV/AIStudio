const { ipcMain, dialog } = require('electron')

var lock = false;
ipcMain.on('open-file-dialog', (event) => {
    if (!lock) {
        lock = true
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections']
        }).then(result => {
            event.sender.send('selected-files', result.filePaths)
            lock = false
        }).catch(err => {
            console.log(err)
            console.log(result)
        })
    }
})