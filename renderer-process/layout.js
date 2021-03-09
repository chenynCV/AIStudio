function updateAppLayout() {
    var length = document.getElementById("selected-files").getElementsByTagName("li").length
    if (length > 0) {
        document.getElementById("welcome").style.display = "none"
        document.getElementById("sidepanel").style.display = ""
        document.getElementById("viewer").style.display = ""
    } else {
        document.getElementById("welcome").style.display = ""
        document.getElementById("sidepanel").style.display = "none"
        document.getElementById("viewer").style.display = "none"
    }
}

window.addEventListener('load', (event) => {
    updateAppLayout()
});

export { updateAppLayout };