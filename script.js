const frame = document.getElementById("frame");
const counter = document.getElementById("counter");
const timer = document.getElementById("timer");
const helper = document.getElementById("helper");

let count; // количество угаданных квадратов (или текущий уровень начиная с 0).
let sideCount; // количество квадратов в одном ряду.
let alpha; // прозрачность. уменьшается с каждым уровнем.
let cancel;
let timerId;
let isRunning; // идет ли игра.
let time; // текущее время в миллисекундах.
let currentElem; // текущий квадрат который надо найти.



function start() {
    // конфигурируем таймер.
    clearInterval(timerId);
    time = 60 * 1000;
    timerId = setInterval(function() {
        timer.innerHTML = time / 1000;
        if (time <= 0) {
            lose();
        }
        time -= 100;
    }, 100);
    
    count = 0;
    counter.innerHTML = count;
    frame.innerHTML = "";
    cancel = false;
    sideCount = 2;
    alpha = 50;
    isRunning = true;
    next();
}

function next() {
    if (!isRunning) return;
    
    counter.innerHTML = count++;

    if (alpha === 100) {
        clearInterval(timerId);
        alert("you won!");
        return;
    }

    frame.innerHTML = "";
    const n = sideCount * sideCount; // общее число квадратов на текущей итерации.
    const cellSize = 690 / sideCount; // длина стороны квадрата 
    sideCount++;

    const hue = getRandomInt(360);
    const saturation = getRandomInt(30) + 30; // от 30 до 60
    const lightness = getRandomInt(25) + 35; // от 35 до 60
    const mainColor = HSLaToRGBa(hue, saturation, lightness, 1)
    const targetColor = HSLaToRGBa(hue, saturation, lightness, alpha / 100)

    for (let i = 0; i < n; i++)
        frame.appendChild(getItem(i, cellSize, mainColor));

    currentElem = document.getElementById(getRandomInt(n));
    currentElem.style.backgroundColor = targetColor;
    currentElem.onclick = () => next();

    alpha += 2.5;
}

function getItem(id, size, color) {
    const margin = Math.max(1, size/Math.PI/10);
    size -= margin;
    const elem = document.createElement('div');
    elem.className += " " + "item";
    elem.id = id;
    elem.style.height = size + "px";
    elem.style.width = size + "px";
    elem.style.backgroundColor = color;
    elem.style.margin = margin + "px" + " 0" + " 0 " + margin + "px";
    elem.onclick = () => lose();
    return elem;
}



function lose() {
    if (!isRunning) return;
    
    currentElem.style.border ="thick solid red";
    clearInterval(timerId);
    isRunning = false;
    alert("you lose with level " + count);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function HSLaToRGBa(h, s, l, a) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + "," + a + ")";
}
