const { ipcRenderer } = require('electron')
import { updateHammerInfo } from './hammer.js'
import { updateAppLayout } from './layout.js'

const viewerBarSelect = document.getElementById("viewer-bar-select")

function updateViewMode(showOutput = false) {
    var index = viewerBarSelect.selectedIndex
    if (index == 1) {
        document.getElementById("img-input").classList.remove("no-display")
        document.getElementById("img-output").classList.add("no-display")
    } else if (index == 2) {
        document.getElementById("img-input").classList.add("no-display")
        document.getElementById("img-output").classList.remove("no-display")
    } else if (index == 0) {
        if (showOutput) {
            document.getElementById("img-input").classList.add("no-display")
            document.getElementById("img-output").classList.remove("no-display")
        } else {
            document.getElementById("img-input").classList.remove("no-display")
            document.getElementById("img-output").classList.add("no-display")
        }
    }
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
                document.getElementById("img-input").src = imgFile
                document.getElementById("viewer-bar").getElementsByTagName('label')[0].innerHTML = imgFile
                updateViewMode(false)
                updateHammerInfo()
            }
        })
        ul.appendChild(li)
    }
}


document.getElementById("task-run").addEventListener('click', (event) => {
    event.preventDefault()
    let imgFile = document.getElementById("img-input").src
    console.log('task-run clicked!')
    ipcRenderer.send("model-run", imgFile)
})


viewerBarSelect.addEventListener('change', (event) => {
    updateViewMode()
})


ipcRenderer.on('model-run-finished', (event, data) => {
    console.log("model-run-finished")
    document.getElementById("img-output").src = data
    updateViewMode(true)
})

export { updateViwerPanel };