const { ipcMain } = require('electron')
const path = require('path')
var Jimp = require('jimp')


ipcMain.on('binarization', (event, threshould, imgFile) => {
    console.log('processing ' + imgFile)
    let outFile = path.join(__dirname, '../logs/_out.png')
    let cb = function () {
        event.sender.send('binarization-finished', outFile)
    }
    Jimp.read(imgFile)
        .then(img => {
            // img.greyscale().scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
            //     if (this.bitmap.data[idx + 0] >= threshould) {
            //         this.bitmap.data[idx + 0] = 255
            //     } else {
            //         this.bitmap.data[idx + 0] = 0
            //     }

            //     if (this.bitmap.data[idx + 1] >= threshould) {
            //         this.bitmap.data[idx + 1] = 255
            //     } else {
            //         this.bitmap.data[idx + 1] = 0
            //     }

            //     if (this.bitmap.data[idx + 2] >= threshould) {
            //         this.bitmap.data[idx + 2] = 255
            //     } else {
            //         this.bitmap.data[idx + 2] = 0
            //     }
            // }).write(outFile, cb)
            img.greyscale().write(outFile, cb)
        })
        .catch(err => {
            console.error(err);
        });
})