import { updateHammerInfo, updateHammerParams } from './hammer.js'
import { updateAppLayout } from './init.js'

function updateViwerPanel(filePaths) {
    var ul = document.getElementById("selected-files")
    for (let i = 0; i < filePaths.length; i++) {
        let filePath = filePaths[i]
        var li = document.createElement("line-" + i.toString())
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
                document.getElementById("img-view").src = imgFile
                document.getElementById("viewer-bar").getElementsByTagName('label')[0].innerHTML = imgFile
                updateHammerInfo()
                updateHammerParams()
            }
        })
        ul.appendChild(li)
    }
}

export { updateViwerPanel };