const fs = require('fs')


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


export { writePng, readPng };