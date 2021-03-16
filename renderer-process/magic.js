const { ipcRenderer } = require('electron')
const path = require('path')
import { getActiveTabInput, setActiveTabOutput, showActiveTabInput } from './viewer.js'
import { writePng } from './utils.js'


document.getElementById("binarization-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile
    let image = getActiveTabInput()
    if (image.src.startsWith("file:")) {
        imgFile = image.src.replace("file:///", "")
    } else if (image.src.startsWith("data:")) {
        imgFile = path.join(__dirname, 'logs/_input.png')
        writePng(image.src, imgFile)
    }

    if (document.getElementsByTagName("input")[0].checked) {
        ipcRenderer.send("binarization", Number(event.target.value), imgFile)
    }
})


ipcRenderer.on('binarization-finished', (event, file) => {
    console.log("binarization-finished")
    setActiveTabOutput(file)
})


document.getElementById("magic-reset").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('magic-reset clicked!')

    const inputEvent = new Event('input');

    document.getElementById("magic-switch-binarization").checked = false
    document.getElementById("binarization-slider").value = 128

    document.getElementById("brightness-slider").value = 1
    document.getElementById("brightness-slider").dispatchEvent(inputEvent)

    document.getElementById("contrast-slider").value = 1
    document.getElementById("contrast-slider").dispatchEvent(inputEvent)

    document.getElementById("hue-rotate-slider").value = 0
    document.getElementById("hue-rotate-slider").dispatchEvent(inputEvent)

    document.getElementById("invert-slider").value = 0
    document.getElementById("invert-slider").dispatchEvent(inputEvent)

    document.getElementById("saturate-slider").value = 1
    document.getElementById("saturate-slider").dispatchEvent(inputEvent)

    document.getElementById("sepia-slider").value = 0
    document.getElementById("sepia-slider").dispatchEvent(inputEvent)

    document.getElementById("grayscale-slider").value = 0
    document.getElementById("grayscale-slider").dispatchEvent(inputEvent)

    showActiveTabInput()
})


document.getElementById("brightness-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/brightness\((.*)\)/)) {
        image.style.filter = style.replace(/brightness\((.*)\)/, `brightness(${event.target.value})`)
    } else {
        image.style.filter = style + ` brightness(${event.target.value})`
    }

    showActiveTabInput()
})


document.getElementById("contrast-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/contrast\((.*)\)/)) {
        image.style.filter = style.replace(/contrast\((.*)\)/, `contrast(${event.target.value})`)
    } else {
        image.style.filter = style + ` contrast(${event.target.value})`
    }

    showActiveTabInput()
})


document.getElementById("hue-rotate-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/hue-rotate\((.*)\)/)) {
        image.style.filter = style.replace(/hue-rotate\((.*)\)/, `hue-rotate(${event.target.value}deg)`)
    } else {
        image.style.filter = style + ` hue-rotate(${event.target.value}deg)`
    }

    showActiveTabInput()
})


document.getElementById("invert-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/invert\((.*)\)/)) {
        image.style.filter = style.replace(/invert\((.*)\)/, `invert(${event.target.value})`)
    } else {
        image.style.filter = style + ` invert(${event.target.value})`
    }

    showActiveTabInput()
})


document.getElementById("saturate-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/saturate\((.*)\)/)) {
        image.style.filter = style.replace(/saturate\((.*)\)/, `saturate(${event.target.value})`)
    } else {
        image.style.filter = style + ` saturate(${event.target.value})`
    }

    showActiveTabInput()
})


document.getElementById("sepia-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/sepia\((.*)\)/)) {
        image.style.filter = style.replace(/sepia\((.*)\)/, `sepia(${event.target.value})`)
    } else {
        image.style.filter = style + ` sepia(${event.target.value})`
    }

    showActiveTabInput()
})


document.getElementById("grayscale-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let image = getActiveTabInput()
    let style = image.style.filter
    if (style.match(/grayscale\((.*)\)/)) {
        image.style.filter = style.replace(/grayscale\((.*)\)/, `grayscale(${event.target.value})`)
    } else {
        image.style.filter = style + ` grayscale(${event.target.value})`
    }

    showActiveTabInput()
})
