const print = console.log
const lerp = (value, lb, ub, lv, uv) => lv + (value-lb)*(uv-lv)/(ub-lb)
const sum = (iterable, key = e=>e) => iterable.reduce((acc, val) => acc + key(val), 0)
const sort = (iterable, key = e=>e) => iterable.sort((a, b) => key(a) - key(b))
const max = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) >= key(acc) ? val : acc, iterable[0])
const min = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) <= key(acc) ? val : acc, iterable[0])
const create_html = (html_string) => new DOMParser().parseFromString(html_string, "text/html").body.firstElementChild

let path_element = null

function setup() {
    path = document.querySelector("#countdown-path")
}

function tick() {
    let date = new Date()
    let seconds_left = (date.getMinutes() * 60 + date.getSeconds());
    path.style.setProperty("--time-elapsed", seconds_left)

    // Text - Time Left
    document.getElementById("time").innerHTML = `<span>${24 - date.getHours() - 1}</span>:<span>${60 - date.getMinutes() - 1}</span>:<span>${60 - date.getSeconds()}</span>`
}

setup()

setInterval(() => tick(), 500)