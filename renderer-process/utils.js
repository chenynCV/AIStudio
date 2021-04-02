const fs = require('fs')
const path = require('path')


function writePng(data, imgFile) {
    let base64Data = data.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(imgFile, base64Data, 'base64', function (err) {
        if (err) {
            console.log(err);
        }
    });
}


function readPng(imgFile) {
    let img = fs.readFileSync(imgFile).toString('base64')
    let imgSrc = "data:image/png;base64," + img
    return imgSrc
}


function stdPath(filePath) {
    filePath = filePath.split(path.sep).join('/')
    return filePath
}


export { writePng, readPng, stdPath };