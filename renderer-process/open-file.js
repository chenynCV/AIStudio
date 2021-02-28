const { ipcRenderer } = require('electron')


document.getElementById("select-file").addEventListener('change', (event) => {
  document.getElementById("select-file").style.display = "none"
  document.getElementById("image-canvas").style.display = ""

  var canvas = document.getElementById("image-canvas")
  var ctx = canvas.getContext('2d')

  let file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = function () {
    var img = new Image()
    img.src = reader.result
    img.onload = function () {
      s = Math.min(canvas.width / img.width, canvas.height / img.height)
      ctx.drawImage(img, 0, 0, s * img.width, s * img.height);
    }
  }
  reader.readAsDataURL(file)


  ipcRenderer.send('open-file-dialog')
})