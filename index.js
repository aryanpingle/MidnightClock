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

class DateRepresentation {
    secondsOTD;
    minutesOTD;
    hoursOTD;
    /**
     * 1:30AM = 013000
     * 1:31AM = 013100
     * 1:30PM = 133000
     */
    dateMask;

    /**
     * 1:31AM - 1:30AM = 000100
     * 2:30AM - 1:40AM = 005000
     */

    constructor(arg, isDateMask=0) {
        if(isDateMask) {
            this.constructorFromDateMask(arg);
        }
        else {
            this.constructorFromDate(arg);
        }
    }

    constructorFromDate(date) {
        this.secondsOTD = date.getSeconds();
        this.minutesOTD = date.getMinutes();
        this.hoursOTD = date.getHours();
        this.dateMask = (this.hoursOTD * 10000) + (this.minutesOTD * 100) + this.secondsOTD;
    }

    constructorFromDateMask(dateMask) {
        this.secondsOTD = dateMask % 1_00;
        if(this.secondsOTD >= 60) {
            this.secondsOTD = 100 - this.secondsOTD;
        }
        this.minutesOTD = parseInt((dateMask % 1_00_00) / 1_00);
        if(this.minutesOTD >= 60) {
            this.minutesOTD = 100 - this.minutesOTD;
        }
        this.hoursOTD = parseInt(dateMask / 1_00_00);
        this.dateMask = (this.hoursOTD * 10000) + (this.minutesOTD * 100) + this.secondsOTD;
    }

    /**
     * Shifts the current DateRepresentation object so that `newDateRepr` is midnight relative to the current object
     * @param {DateRepresentation} newDateRepr 
     */
    static getDifferenceDateRepresentation(startDateRepr, targetDateRepr) {
        let dateMaskStart = targetDateRepr.dateMask;
        let dateMaskEnd = startDateRepr.dateMask;
        if (dateMaskEnd < dateMaskStart) {
            // Add 24 hours to end time
            dateMaskEnd += 24_00_00;
        }
        return new DateRepresentation(dateMaskEnd - dateMaskStart, true);
    }

    toString() {
        return `Date: ${this.dateMask}`;
    }
}

function setup() {
    // Set theme
    if(window.matchMedia("(prefers-color-scheme: light)").matches) {
        document.head.querySelector("meta[name='theme-color']").setAttribute("content", "#efefef");
    }

    seconds_left_group = document.querySelector("#seconds-left-group")
    minutes_left_group = document.querySelector("#minutes-left-group")
    hours_left_group = document.querySelector("#hours-left-group")
    document.querySelectorAll(".countdown-element").forEach((countdown_element, index) => {
        // Set path lengths
        countdown_element.style.setProperty("--path-length", "86401")
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
    const DIVISIONS = 86400;

    const arcUnitSeconds = parseInt(DIVISIONS / 60);
    const arcUnitMinutes = parseInt(DIVISIONS / 60 / 60);
    const arcUnitHours = parseInt(DIVISIONS / 60 / 60 / 24);

    const currentDateRepr = new DateRepresentation(new Date());
    const targetDateRepr = new DateRepresentation(240000, true); // Midnight by default
    const elapsedDateRepr = DateRepresentation.getDifferenceDateRepresentation(currentDateRepr, targetDateRepr);
    console.log(`${elapsedDateRepr}`);

    const elapsedSeconds = elapsedDateRepr.secondsOTD;
    const elapsedMinutes = elapsedDateRepr.minutesOTD;
    const elapsedHours = elapsedDateRepr.hoursOTD;

    // Set Seconds Left
    seconds_left_group.style.setProperty("--time-elapsed", elapsedSeconds * arcUnitSeconds)

    // Set Minutes Left
    minutes_left_group.style.setProperty("--time-elapsed", (elapsedSeconds + elapsedMinutes*60) * arcUnitMinutes)

    // Set Hours Left
    hours_left_group.style.setProperty("--time-elapsed", (elapsedSeconds + elapsedMinutes*60 + elapsedHours*3600) * arcUnitHours);

    // Text - Time Left
    let hours_left = 23 - elapsedHours
    let minutes_left = 59 - elapsedMinutes
    let seconds_left = 59 - elapsedSeconds

    document.getElementById("time-as-text").innerHTML = `
    ${getTimeSubdivision(hours_left, "hours")}
    ${getTimeSubdivision(minutes_left, "minutes", hours_left)}
    ${getTimeSubdivision(seconds_left, "seconds", hours_left || minutes_left)}
    `
}

function getTimeSubdivision(number, text, force_enable=false) {
    if(!force_enable && number == 0 && text !== "seconds") return ""

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