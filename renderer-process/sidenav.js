// Get the container element
var sidenav = document.getElementsByClassName("sidenav")[0];

// Get all buttons with class="btn" inside the container
var sidenav_items = sidenav.getElementsByClassName("sidenav-item");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < sidenav_items.length; i++) {
  sidenav_items[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}


const hammer = document.getElementsByClassName("hammer-container")[0]
const magic = document.getElementsByClassName("magic-container")[0]
const modelZoo = document.getElementsByClassName("modelZoo-container")[0]


function activateHammer() {
  hammer.classList.remove("no-display")
  let btns = document.getElementsByClassName("sidepanel-button-hammer")
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove("no-display")
  }
}


function deactivateHammer() {
  hammer.classList.add("no-display")
  let btns = document.getElementsByClassName("sidepanel-button-hammer")
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.add("no-display")
  }
}


function activateMagic() {
  magic.classList.remove("no-display")
  let btns = document.getElementsByClassName("sidepanel-button-magic")
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove("no-display")
  }
}


function deactivateMagic() {
  magic.classList.add("no-display")
  let btns = document.getElementsByClassName("sidepanel-button-magic")
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.add("no-display")
  }
}


function activateModelZoo() {
  modelZoo.classList.remove("no-display")
  let btns = document.getElementsByClassName("sidepanel-button-modelZoo")
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove("no-display")
  }
}


function deactivateModelZoo() {
  modelZoo.classList.add("no-display")
  let btns = document.getElementsByClassName("sidepanel-button-modelZoo")
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.add("no-display")
  }
}


document.getElementById("hammer").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'HAMMER'
  activateHammer()
  deactivateMagic()
  deactivateModelZoo()
})


document.getElementById("magic").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'MAGIC'
  deactivateHammer()
  activateMagic()
  deactivateModelZoo()
})


document.getElementById("modelZoo").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'MODEL ZOO'
  deactivateHammer()
  deactivateMagic()
  activateModelZoo()
})