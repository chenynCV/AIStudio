const { ipcRenderer } = require('electron')
const path = require('path')
import { tabAttributes } from './globalVars.js'
import { getActiveTabInput, setActiveTabOutput, showActiveTabInput, getCurrentImgFile } from './viewer.js'


function defaultMagicParam() {
    var param = {
        binarization_switch_checked: false,
        binarization_slider_value: 128,
        brightness_slider_value: 1,
        contrast_slider_value: 1,
        hue_rotate_slider_value: 0,
        invert_slider_value: 0,
        saturate_slider_value: 1,
        sepia_slider_value: 0,
        grayscale_slider_value: 0
    };

    return param
}


function setMagic(param = null) {
    if (param === null) {
        param = defaultMagicParam()
    }

    const inputEvent = new Event('input')

    document.getElementById("binarization-switch").checked = param.binarization_switch_checked
    document.getElementById("binarization-slider").value = param.binarization_slider_value

    document.getElementById("brightness-slider").value = param.brightness_slider_value
    document.getElementById("brightness-slider").dispatchEvent(inputEvent)

    document.getElementById("contrast-slider").value = param.contrast_slider_value
    document.getElementById("contrast-slider").dispatchEvent(inputEvent)

    document.getElementById("hue-rotate-slider").value = param.hue_rotate_slider_value
    document.getElementById("hue-rotate-slider").dispatchEvent(inputEvent)

    document.getElementById("invert-slider").value = param.invert_slider_value
    document.getElementById("invert-slider").dispatchEvent(inputEvent)

    document.getElementById("saturate-slider").value = param.saturate_slider_value
    document.getElementById("saturate-slider").dispatchEvent(inputEvent)

    document.getElementById("sepia-slider").value = param.sepia_slider_value
    document.getElementById("sepia-slider").dispatchEvent(inputEvent)

    document.getElementById("grayscale-slider").value = param.grayscale_slider_value
    document.getElementById("grayscale-slider").dispatchEvent(inputEvent)
}


document.getElementById("binarization-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value
    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.binarization_slider_value = event.target.value
        if (document.getElementById("binarization-switch").checked) {
            ipcRenderer.send("binarization", Number(event.target.value), imgFile)
        }
    }
})


ipcRenderer.on('binarization-finished', (event, file) => {
    console.log("binarization-finished")
    setActiveTabOutput(file)
})


document.getElementById("magic-reset").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('magic-reset clicked!')
    setMagic()
    showActiveTabInput()
})


document.getElementById("binarization-switch").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('binarization-switch clicked!')
    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.binarization_switch_checked = event.target.checked
    }
})


document.getElementById("brightness-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.brightness_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/brightness\((.*)\)/)) {
            image.style.filter = style.replace(/brightness\((.*)\)/, `brightness(${event.target.value})`)
        } else {
            image.style.filter = style + ` brightness(${event.target.value})`
        }

        showActiveTabInput()
    }
})


document.getElementById("contrast-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.contrast_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/contrast\((.*)\)/)) {
            image.style.filter = style.replace(/contrast\((.*)\)/, `contrast(${event.target.value})`)
        } else {
            image.style.filter = style + ` contrast(${event.target.value})`
        }

        showActiveTabInput()
    }
})


document.getElementById("hue-rotate-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.hue_rotate_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/hue-rotate\((.*)\)/)) {
            image.style.filter = style.replace(/hue-rotate\((.*)\)/, `hue-rotate(${event.target.value}deg)`)
        } else {
            image.style.filter = style + ` hue-rotate(${event.target.value}deg)`
        }

        showActiveTabInput()
    }
})


document.getElementById("invert-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.invert_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/invert\((.*)\)/)) {
            image.style.filter = style.replace(/invert\((.*)\)/, `invert(${event.target.value})`)
        } else {
            image.style.filter = style + ` invert(${event.target.value})`
        }

        showActiveTabInput()
    }
})


document.getElementById("saturate-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.saturate_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/saturate\((.*)\)/)) {
            image.style.filter = style.replace(/saturate\((.*)\)/, `saturate(${event.target.value})`)
        } else {
            image.style.filter = style + ` saturate(${event.target.value})`
        }

        showActiveTabInput()
    }
})


document.getElementById("sepia-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.sepia_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/sepia\((.*)\)/)) {
            image.style.filter = style.replace(/sepia\((.*)\)/, `sepia(${event.target.value})`)
        } else {
            image.style.filter = style + ` sepia(${event.target.value})`
        }

        showActiveTabInput()
    }
})


document.getElementById("grayscale-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value

    let imgFile = getCurrentImgFile()
    if (imgFile) {
        tabAttributes[imgFile].magic.grayscale_slider_value = event.target.value

        let image = getActiveTabInput()
        let style = image.style.filter
        if (style.match(/grayscale\((.*)\)/)) {
            image.style.filter = style.replace(/grayscale\((.*)\)/, `grayscale(${event.target.value})`)
        } else {
            image.style.filter = style + ` grayscale(${event.target.value})`
        }

        showActiveTabInput()
    }
})


export { defaultMagicParam, setMagic };