const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const glob = require("glob")
var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var Jimp = require('jimp')

const modelPackageFiles = glob.sync(path.join(__dirname, '../models/**/package.json'))
var modelPackages;
var engine;

async function saveImg(dataTensor, savePath, cb) {
    let width = dataTensor.dims[3]
    let height = dataTensor.dims[2]
    const dataImage = ndarray(new Uint8Array(height * width * 4), [height, width, 4]);
    const dataModel = ndarray(new Uint8Array(dataTensor.data), [1, 3, height, width]);

    ops.assign(dataImage.pick(null, null, 0), dataModel.pick(0, 0, null, null));
    ops.assign(dataImage.pick(null, null, 1), dataModel.pick(0, 1, null, null));
    ops.assign(dataImage.pick(null, null, 2), dataModel.pick(0, 2, null, null));
    ops.assigns(dataImage.pick(null, null, 3), 255);

    new Jimp({ data: dataImage.data, width: width, height: height }, (err, image) => {
        return image.write(savePath, cb)
    });
}

function getModels(files) {
    let allPackages = []
    files.forEach((file) => {
        let rawdata = fs.readFileSync(file);
        let aPackage = JSON.parse(rawdata);
        allPackages.push(aPackage)
    })
    return allPackages
}

function loadModule(modulePath) {
    const files = glob.sync(path.join(modulePath, '**/*.js'))
    files.forEach((file) => { require(file) })
}

ipcMain.on('model-packages', (event) => {
    modelPackages = getModels(modelPackageFiles)
    event.sender.send('model-packages-installed', modelPackages)
})

ipcMain.on('model-selected', (event, index) => {
    let modulePath = path.dirname(modelPackageFiles[index])
    const Engine = require(modulePath)
    engine = new Engine();
    console.log(engine)
})

ipcMain.on('model-run', (event, inputFile) => {
    console.log('processing ' + inputFile)
    let outputFile =  path.join(__dirname, '../logs/_out.png')
    let cb  = function() {
        event.sender.send('model-run-finished', outputFile)  
    }
    engine.run(inputFile).then(outputTensor => {
        saveImg(outputTensor, outputFile, cb)
    }).catch(err => {
        console.log(err)
    })
})