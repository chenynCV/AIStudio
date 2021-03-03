const { ipcRenderer } = require('electron')

document.getElementById("welcome").addEventListener('click', (event) => {
  ipcRenderer.send('open-file-dialog')
})

function updateViewer() {
  var length = document.getElementById("selected-files").getElementsByTagName("li").length
  if (length > 0) {
    document.getElementById("welcome").style.display = "none"
    document.getElementById("sidepanel-bar").style.display = ""
    document.getElementById("sidepanel").style.display = ""
    document.getElementById("viewer-bar").style.display = ""
    document.getElementById("viewer").style.display = ""
    document.getElementById("terminal").style.display = ""
  } else {
    document.getElementById("welcome").style.display = ""
    document.getElementById("sidepanel-bar").style.display = "none"
    document.getElementById("sidepanel").style.display = "none"
    document.getElementById("viewer-bar").style.display = "none"
    document.getElementById("viewer").style.display = "none"
    document.getElementById("terminal").style.display = "none"
  }
}

function updateImgInfo() {
  let tb = document.getElementById("hammer-info-table").getElementsByTagName("tbody")[1]
  img_width = document.getElementById("img-input").width
  img_height = document.getElementById("img-input").height

  let rowNum = tb.rows.length;
  for (i = 0; i < rowNum; i++) {
    tb.deleteRow(i);
    rowNum = rowNum - 1;
    i = i - 1;
  }

  tb.insertRow(0).innerHTML = "<tr><td>width</td><td>" + img_width + "</td></tr>";
  tb.insertRow(1).innerHTML = "<tr><td>height</td><td>" + img_height + "</td></tr>";
}

ipcRenderer.on('selected-files', (event, filePaths) => {
  console.log(filePaths)

  var ul = document.getElementById("selected-files")

  for (i = 0; i < filePaths.length; i++) {
    filePath = filePaths[i]
    var li = document.createElement("line-" + i.toString())
    li.innerHTML = `<li>${filePath}<span class="close">x</span></li>`
    li.getElementsByClassName('close')[0].addEventListener("click", function () {
      this.parentNode.parentNode.removeChild(this.parentNode);
      updateViewer();
    })
    li.addEventListener("click", function () {
      const regex = /\<li\>(.*)\<span/i
      const found = this.innerHTML.match(regex)
      if (found) {
        console.log(found[1])
        document.getElementById("img-input").src = found[1]
        updateImgInfo()
      }
    })
    ul.appendChild(li)
  }

  document.getElementById("img-input").src = filePaths[0]
  updateViewer()
})