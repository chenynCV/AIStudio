const { ipcRenderer } = require('electron')
import { creatViewerTab } from './viewer.js'
import { updateAppLayout } from './layout.js'
import { setMagic } from './magic.js'
import { stdPath } from './utils.js'
import { tabAttributes } from './globalVars.js'


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


document.getElementById("viewer-panel-explorer").addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('open-file-dialog')
})


ipcRenderer.on('selected-files', (event, filePaths) => {
    console.log(filePaths)
    updateViwerPanel(filePaths)
    updateAppLayout()
})
