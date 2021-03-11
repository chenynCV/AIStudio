const { ipcRenderer } = require('electron')
const path = require('path')
import { creatViewerTab, getActiveTabImg } from './viewer.js'
import { writePng, readPng } from './utils.js'


document.getElementById("binarization-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value
})


document.getElementById("binarization-slider").addEventListener('mouseup', (event) => {
    let imgFile
    let image = getActiveTabImg()
    if (image.src.startsWith("file:")) {
        imgFile = image.src.replace("file:///", "")
    } else if (image.src.startsWith("data:")) {
        imgFile = path.join(__dirname, 'logs/_input.png')
        writePng(image.src, imgFile)
    }

    if (document.getElementById("magic-auto").checked) {
        ipcRenderer.send("binarization", event.target.value, imgFile)
    }
})


ipcRenderer.on('binarization-finished', (event, file) => {
    console.log("binarization-finished")
    creatViewerTab(file)
    getActiveTabImg().src = readPng(file)
})