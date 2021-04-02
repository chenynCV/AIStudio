const path = require('path')
import { tabAttributes } from './globalVars.js'
import { updateHammerInfo } from './hammer.js'
import { defaultMagicParam, setMagic } from './magic.js'
import { updateAppLayout } from './layout.js'
import { readPng, stdPath } from './utils.js'



function getActiveTabIndex() {
    let tablinks = document.getElementById("viewer-tab").getElementsByTagName("a")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i].classList.contains("active")) {
            return i
        }
    }
}


function getActiveTabContainer() {
    let container = document.getElementsByClassName("viewer-main-container")[getActiveTabIndex()]
    return container
}


function getActiveTabDisplay() {
    let imgs = getActiveTabContainer().children
    for (var i = 0; i < imgs.length; i++) {
        if (!imgs[i].classList.contains("no-display")) {
            return imgs[i]
        }
    }
    return imgs[0]
}


function getActiveTabInput() {
    if (getActiveTabContainer()) {
        let imgs = getActiveTabContainer().children
        return imgs[0]
    }
}


function getCurrentImgFile() {
    if (getActiveTabInput()) {
        let imgFile
        let image = getActiveTabInput()
        if (image.src.startsWith("file:")) {
            imgFile = image.src.replace("file:///", "")
        }
        return imgFile
    }
}


function getTablinkByName(name) {
    let tablinks = document.getElementById("viewer-tab").getElementsByTagName("a")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i].id.includes(stdPath(name))) {
            return tablinks[i]
        }
    }
}


function activateTab(tablink) {
    let tablinks = document.getElementById("viewer-tab").getElementsByTagName("a")
    let tabcontent = document.getElementsByClassName("viewer-main-container")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i] === tablink) {
            tablinks[i].classList.add("active")
            tabcontent[i].classList.remove("no-display")
            let imgFile = tablinks[i].id.replace("tablink#", "")
            document.getElementById("viewer-main-bar").innerHTML = imgFile
            console.log("activating ...")
            console.log(tablinks[i])
        } else {
            tablinks[i].classList.remove("active")
            tabcontent[i].classList.add("no-display")
        }
    }
    updateHammerInfo(getActiveTabDisplay())
}


function activateLastTab() {
    let tablinks = document.getElementById("viewer-tab").getElementsByTagName("a")
    activateTab(tablinks[tablinks.length - 1])
}


function delViewerTab(name) {
    if (document.getElementById("tablink#" + name)) {
        console.log('deleting tablink:' + name)
        let tablink = document.getElementById("tablink#" + name)
        tablink.parentNode.removeChild(tablink)
    }
    if (document.getElementById("container#" + name)) {
        console.log('deleting tabcontent:' + name)
        let tabcontent = document.getElementById("container#" + name)
        tabcontent.parentNode.removeChild(tabcontent)
    }
}


function creatViewerTab(imgFile) {
    let tablink = getTablinkByName(imgFile)
    if (tablink) {
        activateTab(tablink)
        let container = getActiveTabContainer()
        let imgs = container.children
        imgs[0].classList.remove("no-display")
        if (imgs.length > 1) {
            imgs[1].classList.add("no-display")
        }
        return
    }

    tabAttributes[imgFile] = {}
    tabAttributes[imgFile].magic = defaultMagicParam()

    let img = document.createElement("img")
    img.classList.add("img-center")
    img.classList.add("scale-to-fit")
    img.src = imgFile
    img.onload = function () {
        updateHammerInfo(this)
    }

    let container = document.createElement("div")
    container.id = "container#" + imgFile
    container.classList.add("viewer-main-container")
    container.appendChild(img)
    document.getElementById("viewer-main").appendChild(container)

    let a = document.createElement("a")
    a.id = "tablink#" + imgFile
    a.href = "#"
    let imgName = path.basename(imgFile)
    a.innerHTML = `${imgName}<span class="close">x</span>`
    a.getElementsByClassName('close')[0].addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        let imgFile = this.parentNode.id.replace("tablink#", "")
        console.log(`del ${imgFile}`)
        delViewerTab(imgFile)
        activateLastTab()
    })
    a.classList.add("viewer-tab")
    a.classList.add("active")
    a.onclick = function (e) {
        e.preventDefault()
        activateTab(this)
        let imgFile = getCurrentImgFile()
        if (imgFile) {
            setMagic(tabAttributes[imgFile].magic)
        }
    }
    document.getElementById("viewer-tab").appendChild(a)

    activateTab(a)
}


function showActiveTabInput() {
    let container = getActiveTabContainer()
    let imgs = container.children
    imgs[0].classList.remove("no-display")
    for (var i = 1; i < imgs.length; i++) {
        imgs[i].classList.add("no-display")
    }
}


function showTabOutput(container) {
    let imgs = container.children
    for (var i = 0; i < imgs.length - 1; i++) {
        imgs[i].classList.add("no-display")
    }
    imgs[imgs.length - 1].classList.remove("no-display")
}


function setActiveTabOutput(outputFile) {
    let container = getActiveTabContainer()
    let imgs = container.children

    if (imgs.length > 1) {
        imgs[imgs.length - 1].src = readPng(outputFile)
    } else {
        let img = document.createElement("img")
        img.classList.add("img-center")
        img.classList.add("scale-to-fit")
        img.src = outputFile
        img.onload = function () {
            updateHammerInfo(this)
        }
        container.appendChild(img)
    }

    showTabOutput(container)
}


function updateViwerPanel(filePaths) {
    var ul = document.getElementById("selected-files")
    for (let i = 0; i < filePaths.length; i++) {
        let filePath = stdPath(filePaths[i])
        var li = document.createElement("ViwerPanel-line-" + i.toString())
        li.innerHTML = `<li>${filePath}<span class="close">x</span></li>`
        li.getElementsByClassName('close')[0].addEventListener("click", function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
            updateAppLayout();
        })
        li.addEventListener("click", function () {
            const regex = /\<li\>(.*)\<span/i
            const found = this.innerHTML.match(regex)
            if (found) {
                let imgFile = stdPath(found[1])
                console.log(imgFile)
                creatViewerTab(imgFile)
                setMagic(tabAttributes[imgFile].magic)
            }
        })
        ul.appendChild(li)
    }
}


function zoomImage(image, container, scale = 1) {
    if (scale >= 3) {
        image.classList.add('pixelated');
    } else {
        image.classList.remove('pixelated');
    }

    const dx = (window.scrollX + container.clientWidth / 2) / container.scrollWidth;
    const dy = (window.scrollY + container.clientHeight / 2) / container.scrollHeight;

    image.classList.remove('scale-to-fit');
    image.style.minWidth = `${(image.naturalWidth * scale)}px`;
    image.style.width = `${(image.naturalWidth * scale)}px`;

    const newScrollX = container.scrollWidth * dx - container.clientWidth / 2;
    const newScrollY = container.scrollHeight * dy - container.clientHeight / 2;

    window.scrollTo(newScrollX, newScrollY);
}


document.getElementById("zoom-level").addEventListener('change', (event) => {
    var index = event.target.selectedIndex
    const container = getActiveTabContainer()
    let image = getActiveTabDisplay()
    if (index === 0) {
        image.classList.add('scale-to-fit');
        image.classList.remove('pixelated');
        image.style.minWidth = 'auto';
        image.style.width = 'auto';
    } else if (index === 1) {
        let scale = 2 * image.width / image.naturalWidth
        console.log(scale)
        zoomImage(image, container, scale)
    }
})


export { updateViwerPanel, getActiveTabDisplay, getActiveTabInput, setActiveTabOutput, showActiveTabInput, getCurrentImgFile };