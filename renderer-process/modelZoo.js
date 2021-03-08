const { ipcRenderer } = require('electron')
import { updateModelInfo } from './hammer.js'

ipcRenderer.on('model-packages-installed', (event, modelPackages) => {
    let zoo = document.getElementById("modelZoo-models")
    while (zoo.firstChild) {
        zoo.removeChild(zoo.firstChild);
    }

    let select = document.getElementById("hammer-model-select")
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for (let i = 0; i < modelPackages.length; i++) {
        let modelPackage = modelPackages[i]
        let displayName = modelPackage['displayName']
        let version = modelPackage['version']
        let description = modelPackage['description']
        var li = document.createElement("modelZoo-line-" + i.toString())
        li.innerHTML = `<li>` + displayName + `<span class="version">` + version + `</span>` + `<span class="description">` + description + `</span></li>`
        li.addEventListener("click", function () {
            console.log(modelPackage)
        })
        zoo.appendChild(li)

        var option = document.createElement("option");
        option.text = displayName;
        select.add(option);
    }

    select.selectedIndex = "0";
    updateModelInfo(modelPackages[0]['contributes']['hammer-model-info-table'])
    ipcRenderer.send('model-selected', 0)
})
