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

document.getElementById("hammer").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'HAMMER'
  document.getElementsByClassName("hammer-container")[0].classList.remove("no-display")
  document.getElementsByClassName("modelZoo-container")[0].classList.add("no-display")
})

document.getElementById("modelZoo").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'MODEL ZOO'
  document.getElementsByClassName("modelZoo-container")[0].classList.remove("no-display")
  document.getElementsByClassName("hammer-container")[0].classList.add("no-display")
})