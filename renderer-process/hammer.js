const { ipcRenderer } = require('electron')
const path = require('path')
import { writePng } from './utils.js'
import { getActiveTabDisplay, setActiveTabOutput } from './viewer.js'

var modelPackages = [];

ipcRenderer.on('model-packages-installed', (event, data) => {
    modelPackages = data
})

function updateHammerInfo(img) {
    let tb = document.getElementById("hammer-input-info-table").getElementsByTagName("tbody")[1]
    let img_width = img.naturalWidth
    let img_height = img.naturalHeight

    let rowNum = tb.rows.length;
    for (let i = 0; i < rowNum; i++) {
        tb.deleteRow(i);
        rowNum = rowNum - 1;
        i = i - 1;
    }

    tb.insertRow(0).innerHTML = "<tr><td>width</td><td>" + img_width + "</td></tr>";
    tb.insertRow(1).innerHTML = "<tr><td>height</td><td>" + img_height + "</td></tr>";
}


function updateModelInfo(modelInfo) {
    let tb = document.getElementById("hammer-model-info-table").getElementsByTagName("tbody")[1]

    let rowNum = tb.rows.length;
    for (let i = 0; i < rowNum; i++) {
        tb.deleteRow(i);
        rowNum = rowNum - 1;
        i = i - 1;
    }

    tb.insertRow(0).innerHTML = "<tr><td>Params</td><td>" + modelInfo['Params'] + "</td></tr>";
    tb.insertRow(1).innerHTML = "<tr><td>Flops</td><td>" + modelInfo['Flops'] + "</td></tr>";
    tb.insertRow(2).innerHTML = "<tr><td>Description</td><td>" + modelInfo['Description'] + "</td></tr>";
    tb.insertRow(3).innerHTML = "<tr><td>Contributors</td><td>" + modelInfo['Contributors'] + "</td></tr>";
}


document.getElementById("hammer-params-title").addEventListener('click', (event) => {
    document.getElementsByClassName("hide")[0].classList.toggle("no-display")
})


document.getElementById("hammer-input-info-title").addEventListener('click', (event) => {
    document.getElementsByClassName("hide")[1].classList.toggle("no-display")
})


document.getElementById("hammer-model-info-title").addEventListener('click', (event) => {
    document.getElementsByClassName("hide")[2].classList.toggle("no-display")
})


document.getElementById("hammer-model-select").addEventListener('change', (event) => {
    var index = event.target.selectedIndex
    let modelPackage = modelPackages[index]
    console.log(modelPackage)
    let modelInfo = modelPackage['contributes']['hammer-model-info-table']
    updateModelInfo(modelInfo)
    ipcRenderer.send('model-selected', index)
})


document.getElementById("model-run").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('model-run clicked!')

    let imgFile
    let image = getActiveTabDisplay()
    if (image.src.startsWith("file:")) {
        imgFile = image.src.replace("file:///", "")
    } else if (image.src.startsWith("data:")) {
        imgFile = path.join(__dirname, 'logs/_input.png')
        writePng(image.src, imgFile)
    }
    console.log(imgFile)
    ipcRenderer.send("model-run", imgFile)
})


ipcRenderer.on('model-run-finished', (event, outputFile) => {
    console.log("model-run-finished")
    setActiveTabOutput(outputFile)
})


export { updateHammerInfo, updateModelInfo };