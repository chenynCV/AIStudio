document.getElementById("binarization-slider").addEventListener('input', (event) => {
    event.target.parentNode.getElementsByClassName("tooltiptext")[0].innerHTML = event.target.value
})