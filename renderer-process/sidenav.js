// Get the container element
var sidenav = document.getElementsByClassName("sidenav")[0];

// Get all buttons with class="btn" inside the container
var sidenav_items = sidenav.getElementsByClassName("sidenav-item");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < sidenav_items.length; i++) {
    sidenav_items[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

document.getElementById("hammer").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'HAMMER'
})

document.getElementById("model-zoo").addEventListener('click', (event) => {
  document.getElementById("sidepanel-title").innerHTML = 'MODEL ZOO'
})
