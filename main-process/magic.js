const { ipcMain } = require('electron')
const path = require('path')
var Jimp = require('jimp')


var lock = false;
ipcMain.on('binarization', (event, threshould, imgFile) => {
    if (!lock) {
        lock = true
        console.log('binarization ' + imgFile)
        let outputFile = path.join(__dirname, '../logs/_out.png')
        let cb = function () {
            event.sender.send('binarization-finished', outputFile)
        }
        Jimp.read(imgFile)
            .then(img => {
                img.greyscale().scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
                    if (this.bitmap.data[idx + 0] >= threshould) {
                        this.bitmap.data[idx + 0] = 255
                        this.bitmap.data[idx + 1] = 255
                        this.bitmap.data[idx + 2] = 255
                    } else {
                        this.bitmap.data[idx + 0] = 0
                        this.bitmap.data[idx + 1] = 0
                        this.bitmap.data[idx + 2] = 0
                    }
                    this.bitmap.data[idx + 3] = 255
                }).write(outputFile, cb)
            })
            .catch(err => {
                console.error(err)
            })
        lock = false
    }
})