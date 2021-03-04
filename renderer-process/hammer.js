function updateHammerInfo() {
    let tb = document.getElementById("hammer-info-table").getElementsByTagName("tbody")[1]
    let img_width = document.getElementById("img-view").width
    let img_height = document.getElementById("img-view").height

    let rowNum = tb.rows.length;
    for (let i = 0; i < rowNum; i++) {
        tb.deleteRow(i);
        rowNum = rowNum - 1;
        i = i - 1;
    }

    tb.insertRow(0).innerHTML = "<tr><td>width</td><td>" + img_width + "</td></tr>";
    tb.insertRow(1).innerHTML = "<tr><td>height</td><td>" + img_height + "</td></tr>";
}

function updateHammerParams() {
    let tb = document.getElementById("hammer-params-table").getElementsByTagName("tbody")[1]
    let img_width = document.getElementById("img-view").width
    let img_height = document.getElementById("img-view").height

    let rowNum = tb.rows.length;
    for (let i = 0; i < rowNum; i++) {
        tb.deleteRow(i);
        rowNum = rowNum - 1;
        i = i - 1;
    }

    tb.insertRow(0).innerHTML = "<tr><td>input-width</td><td>" + img_width + "</td></tr>";
    tb.insertRow(1).innerHTML = "<tr><td>input-height</td><td>" + img_height + "</td></tr>";
}


document.getElementById("hammer-params-title").addEventListener('click', (event) => {
    document.getElementsByClassName("hide")[0].classList.toggle("no-display")
})


document.getElementById("hammer-info-title").addEventListener('click', (event) => {
    document.getElementsByClassName("hide")[1].classList.toggle("no-display")
})

export { updateHammerInfo, updateHammerParams };