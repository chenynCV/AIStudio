const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
import { updateHammerInfo } from './hammer.js'
import { updateAppLayout } from './layout.js'


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


function getActiveTabIndex() {
    let tablinks = document.getElementsByClassName("viewer-tab")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i].classList.contains("active")) {
            return i
        }
    }
}


function getActiveTabContainer() {
    let image = document.getElementsByClassName("viewer-main-img")[getActiveTabIndex()]
    return image
}


function getActiveTabImg() {
    let image = document.getElementsByClassName("viewer-main-img")[getActiveTabIndex()].children[0]
    return image
}


function getActiveTabBar() {
    let image = document.getElementsByClassName("viewer-main-bar")[getActiveTabIndex()]
    return image
}


function activateTab(tablink) {
    let tablinks = document.getElementsByClassName("viewer-tab")
    let tabcontent = document.getElementsByClassName("viewer-main")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i] === tablink) {
            tablinks[i].classList.add("active")
            tabcontent[i].classList.remove("no-display")
            console.log("activating ...")
            console.log(tablinks[i])
        } else {
            tablinks[i].classList.remove("active")
            tabcontent[i].classList.add("no-display")
        }
    }
    updateHammerInfo(getActiveTabImg())
}

function activateLastTab() {
    let tablinks = document.getElementsByClassName("viewer-tab")
    activateTab(tablinks[tablinks.length - 1])
}


function delViewerTab(imgFile) {
    if (document.getElementById(imgFile + "-tablink")) {
        console.log('del tablink:' + imgFile)
        let tablink = document.getElementById(imgFile + "-tablink")
        tablink.parentNode.removeChild(tablink)
    }
    if (document.getElementById(imgFile + "-tabcontent")) {
        console.log('del tabcontent:' + imgFile)
        let tabcontent = document.getElementById(imgFile + "-tabcontent")
        tabcontent.parentNode.removeChild(tabcontent)
    }
}


function creatViewerTab(imgFile) {
    if (document.getElementById(imgFile + "-tablink")) {
        activateTab(document.getElementById(imgFile + "-tablink"))
        return
    }

    let bar = document.createElement("div")
    bar.classList.add("viewer-main-bar")
    bar.innerHTML = imgFile

    let img = document.createElement("img")
    img.classList.add("img-center")
    img.classList.add("scale-to-fit")
    img.src = imgFile
    img.onload = function () {
        updateHammerInfo(this)
    }
    let imgDiv = document.createElement("div")
    imgDiv.classList.add("viewer-main-img")
    imgDiv.appendChild(img)

    let main = document.createElement("div")
    main.id = imgFile + "-tabcontent"
    main.classList.add("viewer-main")
    main.appendChild(bar)
    main.appendChild(imgDiv)
    document.getElementById("viewer").appendChild(main)

    let a = document.createElement("a")
    a.id = imgFile + "-tablink"
    let imgName = path.basename(imgFile)
    a.innerHTML = `${imgName}<span class="close">x</span>`
    a.getElementsByClassName('close')[0].addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        let imgFile = this.parentNode.id.replace("-tablink", "")
        console.log(`del ${imgFile}`)
        delViewerTab(imgFile)
        activateLastTab()
    })
    a.classList.add("viewer-tab")
    a.classList.add("active")
    a.onclick = function (e) {
        e.preventDefault()
        activateTab(this)
    }
    console.log(a)
    document.getElementById("viewer-tab").appendChild(a)
    activateTab(a)
}


function updateViwerPanel(filePaths) {
    var ul = document.getElementById("selected-files")
    for (let i = 0; i < filePaths.length; i++) {
        let filePath = filePaths[i]
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
                let imgFile = found[1]
                console.log(imgFile)
                creatViewerTab(imgFile)
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
    let image = getActiveTabImg()
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


document.getElementById("task-run").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('task-run clicked!')

    let imgFile
    let image = getActiveTabImg()
    if (image.src.startsWith("file:")) {
        imgFile = image.src.replace("file:///", "")
    } else if (image.src.startsWith("data:")) {
        imgFile = path.join(__dirname, 'logs/_input.png')
        writePng(image.src, imgFile)
    }
    console.log(imgFile)
    ipcRenderer.send("model-run", imgFile)
})


ipcRenderer.on('model-run-finished', (event, file) => {
    console.log("model-run-finished")
    creatViewerTab(file)
    getActiveTabImg().src = readPng(file)
})


export { updateViwerPanel };