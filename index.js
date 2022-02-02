const print = console.log
const lerp = (value, lb, ub, lv, uv) => lv + (value-lb)*(uv-lv)/(ub-lb)
const sum = (iterable, key = e=>e) => iterable.reduce((acc, val) => acc + key(val), 0)
const sort = (iterable, key = e=>e) => iterable.sort((a, b) => key(a) - key(b))
const max = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) >= key(acc) ? val : acc, iterable[0])
const min = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) <= key(acc) ? val : acc, iterable[0])
const create_html = (html_string) => new DOMParser().parseFromString(html_string, "text/html").body.firstElementChild

let path_element = null
const countdown_arc_width = 75

function setup() {
    document.querySelectorAll(".countdown-element").forEach((countdown_element, index) => {
        // Set path lengths
        countdown_element.style.setProperty("--path-length", countdown_element.getAttribute("pathLength"))
        countdown_element.querySelectorAll("circle").forEach(circle => {
            circle.setAttribute("pathLength", countdown_element.getAttribute("pathLength"))
            
            // Set radius
            // [0] = 1000 - width/2
            // [1] = 1000 - 3*width/2
            // ...
            // [i] = 1000 - width*(1+2i)/2
            circle.setAttribute("r", 500 - countdown_arc_width*(1 + 2*index)/2)
        })
    })
}

function tick() {
    let date = new Date()

    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    // Set Seconds Left
    document.querySelector("#seconds-left-group").style.setProperty("--time-elapsed", seconds)

    // Set Minutes Left
    document.querySelector("#minutes-left-group").style.setProperty("--time-elapsed", seconds + minutes*60)

    // Set Hours Left
    document.querySelector("#hours-left-group").style.setProperty("--time-elapsed", seconds + minutes*60 + hours*3600)

    // Text - Time Left
    document.getElementById("time-as-text").innerHTML = `<span>${24 - date.getHours() - 1}</span>:<span>${60 - date.getMinutes() - 1}</span>:<span>${(60 - date.getSeconds())}</span>`
}

setup()
setInterval(() => tick(), 500)