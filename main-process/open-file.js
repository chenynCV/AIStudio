const { ipcMain, dialog } = require('electron')
var fs = require('fs');

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        let filepath = result.filePaths[0]
        fs.readFile(filepath, 'base64', (err, data) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }
            data = "data:image/jpeg;base64," + data
            event.sender.send('selected-file-content', data)
        })
    }).catch(err => {
        console.log(err)
        console.log(result)
    })
})