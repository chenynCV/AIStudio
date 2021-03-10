const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
import { updateHammerInfo } from './hammer.js'
import { updateAppLayout } from './layout.js'

const image = document.getElementById("img-to-show")

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
                image.src = imgFile
                document.getElementById("viewer-bar").getElementsByTagName('label')[0].innerHTML = imgFile
                updateHammerInfo()
            }
        })
        ul.appendChild(li)
    }
}


document.getElementById("task-run").addEventListener('click', (event) => {
    event.preventDefault()
    console.log('task-run clicked!')
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
    console.log(index)
    if (index === 0) {
        image.classList.add('scale-to-fit');
        image.classList.remove('pixelated');
        image.style.minWidth = 'auto';
        image.style.width = 'auto';
        vscode.setState(undefined);
    } else {
        scale = clamp(newScale, MIN_SCALE, MAX_SCALE);
        if (scale >= PIXELATION_THRESHOLD) {
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

        vscode.setState({ scale: scale, offsetX: newScrollX, offsetY: newScrollY });
    }
})


ipcRenderer.on('model-run-finished', (event, data) => {
    console.log("model-run-finished")
    image.src = data
})

export { updateViwerPanel };