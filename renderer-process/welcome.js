import { updateHammerInfo } from './hammer.js'
import { updateAppLayout } from './layout.js'
import { updateViwerPanel } from './viewer.js'
const { ipcRenderer } = require('electron')

document.getElementById("welcome").addEventListener('click', (event) => {
  event.preventDefault()
  ipcRenderer.send('model-packages')
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-files', (event, filePaths) => {
  console.log(filePaths)
  updateViwerPanel(filePaths)
  if (filePaths.length > 0) {
    document.getElementById("img-input").src = filePaths[0]
  }
  updateAppLayout()
  updateHammerInfo()
})