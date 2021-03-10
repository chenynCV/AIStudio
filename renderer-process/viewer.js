const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
import { updateHammerInfo } from './hammer.js'
import { updateAppLayout } from './layout.js'

var viewerNames = new Array()

function removeByVal(array, val) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == val) {
            array.splice(i, 1);
            break;
        }
    }
}

function getActiveIndex() {
    let tablinks = document.getElementsByClassName("viewer-tab")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i].classList.contains("active")) {
            return i
        }
    }
}


function getActiveImg() {
    let image = document.getElementsByClassName("viewer-main-img")[getActiveIndex()].children[0]
    return image
}


function getActiveBar() {
    let image = document.getElementsByClassName("viewer-main-bar")[getActiveIndex()]
    return image
}


function updataViewerStatus(tablink) {
    let tablinks = document.getElementsByClassName("viewer-tab")
    let tabcontent = document.getElementsByClassName("viewer-main")
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i] === tablink) {
            tablinks[i].classList.add("active")
            tabcontent[i].classList.remove("no-display")
        } else {
            tablinks[i].classList.remove("active")
            tabcontent[i].classList.add("no-display")
        }
    }
}


function creatViewerTab(imgFile) {
    if (viewerNames.includes(imgFile)) {
        return
    }
    viewerNames.push(imgFile)

    let a = document.createElement("a")
    a.text = "Preview"
    a.classList.add("viewer-tab")
    a.classList.add("active")
    a.onclick = function () {
        updataViewerStatus(this)
    }
    console.log(a)
    document.getElementById("viewer-tab").appendChild(a)

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
    main.classList.add("viewer-main")
    main.appendChild(bar)
    main.appendChild(imgDiv)
    document.getElementById("viewer").appendChild(main)

    updataViewerStatus(a)
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


document.getElementById("task-run").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('task-run clicked!')
    let image = getActiveImg()
    let imgFile;
    if (image.src.startsWith("file:")) {
        imgFile = image.src.replace("file:///", "")
    } else if (image.src.startsWith("data:")) {
        imgFile = path.join(__dirname, 'logs/_input.png')
        let base64Data = image.src.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(imgFile, base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    console.log(imgFile)
    ipcRenderer.send("model-run", imgFile)
})


document.getElementById("zoom-level").addEventListener('change', (event) => {
    var index = event.target.selectedIndex
    const container = document.getElementsByClassName("viewer-main-img")[0]
    let image = getActiveImg()
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


ipcRenderer.on('model-run-finished', (event, data) => {
    console.log("model-run-finished")
    let image = getActiveImg()
    image.src = data

    let bar = getActiveBar()
    removeByVal(viewerNames, bar.innerHTML)
    bar.innerHTML += "^_^"
    viewerNames.push(bar.innerHTML)
})


export { updateViwerPanel };