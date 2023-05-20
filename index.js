const print = console.log
const lerp = (value, lb, ub, lv, uv) => lv + (value-lb)*(uv-lv)/(ub-lb)
const sum = (iterable, key = e=>e) => iterable.reduce((acc, val) => acc + key(val), 0)
const sort = (iterable, key = e=>e) => iterable.sort((a, b) => key(a) - key(b))
const max = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) >= key(acc) ? val : acc, iterable[0])
const min = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) <= key(acc) ? val : acc, iterable[0])
const create_html = (html_string) => new DOMParser().parseFromString(html_string, "text/html").body.firstElementChild

const countdown_arc_width = 120

let seconds_left_group = null
let minutes_left_group = null
let hours_left_group = null

function setup() {
    seconds_left_group = document.querySelector("#seconds-left-group")
    minutes_left_group = document.querySelector("#minutes-left-group")
    hours_left_group = document.querySelector("#hours-left-group")
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

        // Set arc widths
        countdown_element.style.setProperty("--stroke-width", countdown_arc_width)
    })
}

function tick() {
    let date = new Date()

    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    // Set Seconds Left
    seconds_left_group.style.setProperty("--time-elapsed", seconds * 1440)

    // Set Minutes Left
    minutes_left_group.style.setProperty("--time-elapsed", (seconds + minutes*60) * 24)

    // Set Hours Left
    hours_left_group.style.setProperty("--time-elapsed", seconds + minutes*60 + hours*3600)

    // Text - Time Left
    let hours_left = 24 - date.getHours() - 1
    let minutes_left = 60 - date.getMinutes() - 1
    let seconds_left = 60 - date.getSeconds()

    if (seconds_left == 60) {
        seconds_left = 0
        ++minutes_left
    }
    if(minutes_left == 60) {
        minutes_left = 0
        ++hours_left
    }

    document.getElementById("time-as-text").innerHTML = `
    ${getTimeSubdivision(hours_left, "hours")}
    ${getTimeSubdivision(minutes_left, "minutes")}
    ${getTimeSubdivision(seconds_left, "seconds")}
    `
}

function getTimeSubdivision(number, text) {
    if(number == 0 && text !== "seconds") return ""

    return `
    <div class="time-subdivision" subdivision-type="${text}">
        <div class="time-value">${(number < 10 ? "0" : "") + number}</div>
        <div class="time-text">${text}</div>
    </div>
    `
}

setup()
tick()
setInterval(() => tick(), 500)