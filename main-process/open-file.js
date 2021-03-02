const { ipcMain, dialog } = require('electron')

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    }).then(result => {
        event.sender.send('selected-files', result.filePaths)
    }).catch(err => {
        console.log(err)
        console.log(result)
    })
})