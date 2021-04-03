const { ipcRenderer } = require('electron')


document.getElementById("welcome").addEventListener('click', (event) => {
  event.preventDefault()
  ipcRenderer.send('model-packages')
  ipcRenderer.send('open-file-dialog')
})