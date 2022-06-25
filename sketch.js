// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

const canvasScale = 2;
const imgWidth = 257;
const colorOffset = 127;

const sourceA = [127, 127];
const omega = 6;
const stepsPerFrame = 5;
const phaseVelocity = 0.1;
const alpha = 0.1;

const dt = 1 / 60 / stepsPerFrame;
const dx = 1 / imgWidth;
const c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dx;

let img;
let u = new Array(imgWidth); // u(t)
let u_next = new Array(imgWidth); // u(t)
let u_prev = new Array(imgWidth); // u(t)
let t = 0;

let paused = false;
let secondSourceEnabled = false;
let wasMousePressed = false;
let draggedSourceIndex = null;
const sourcePosition = [
    [128, 128],
    [10, 10]
];


function setup() {
    createCanvas(imgWidth * canvasScale, imgWidth * canvasScale);
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(imgWidth, imgWidth);

    createCheckbox('Paused')
        .changed(evt => paused = evt.target.checked);
    createCheckbox('Second source enabled')
        .changed(evt => secondSourceEnabled = evt.target.checked);

    for (let i = 0; i < imgWidth; ++i) {
        u[i] = new Array(imgWidth);
        u_next[i] = new Array(imgWidth);
        u_prev[i] = new Array(imgWidth);
    }

    for (let x = 0; x < imgWidth; ++x)
        for (let y = 0; y < imgWidth; ++y) {
            u[x][y] = 0;
            u_next[x][y] = 0;
            u_prev[x][y] = 0;
        }
}

function update() {

    for (let x = 1; x < imgWidth - 1; ++x)
        for (let y = 1; y < imgWidth - 1; ++y) {
            u_next[x][y] = 2 * u[x][y] - u_prev[x][y];
            u_next[x][y] += c2 * (u[x + 1][y] - 2 * u[x][y] + u[x - 1][y]);
            u_next[x][y] += c2 * (u[x][y + 1] - 2 * u[x][y] + u[x][y - 1]);
            u_next[x][y] -= alpha * dt * (u[x][y] - u_prev[x][y]);
        }

    // edges
    for (let x = 0; x < imgWidth; ++x) {
        u_next[x][0] = u_next[x][1];
        u_next[0][x] = u_next[1][x];
        u_next[x][imgWidth - 1] = u_next[x][imgWidth - 2];
        u_next[imgWidth - 1][x] = u_next[imgWidth - 2][x];
    }

    for (let x = 0; x < imgWidth; ++x) {
        u_prev[x] = u[x].slice();
        u[x] = u_next[x].slice();
    }
}

function moveSources() {
    if (mouseIsPressed != wasMousePressed) {
        wasMousePressed = mouseIsPressed;
        if (mouseIsPressed && isMouseInsideCanvas()) {
            if (secondSourceEnabled) {
                let distToFirst = dist(floor(mouseX / canvasScale), floor(mouseY / canvasScale), sourcePosition[0][0], sourcePosition[0][1]);
                let distToSecond = dist(floor(mouseX / canvasScale), floor(mouseY / canvasScale), sourcePosition[1][0], sourcePosition[1][1]);
                draggedSourceIndex = distToSecond < distToFirst ? 1 : 0;
            } else
                draggedSourceIndex = 0;
        } else
            draggedSourceIndex = null;
    }

    if (draggedSourceIndex !== null) {
        sourcePosition[draggedSourceIndex][0] = clamp(floor(mouseX / canvasScale), 0, imgWidth - 1);
        sourcePosition[draggedSourceIndex][1] = clamp(floor(mouseY / canvasScale), 0, imgWidth - 1);
    }
}

function draw() {
    moveSources();

    if (paused)
        return;

    for (let step = 0; step < stepsPerFrame; ++step) {
        for (let i = 0; i < 1 + Number(secondSourceEnabled); i++)
            u[sourcePosition[i][0]][sourcePosition[i][1]] = sourceA[i] * sin(omega * t);
        update();
        t += dt;
    }
    img.loadPixels();
    for (let x = 0; x < imgWidth; ++x)
        for (let y = 0; y < imgWidth; ++y)
            img.set(x, y, colorOffset + u[x][y]);

    img.updatePixels();
    image(img, 0, 0, imgWidth * canvasScale, imgWidth * canvasScale);
}

function isMouseInsideCanvas() {
    return 0 <= mouseX && mouseX < imgWidth * canvasScale && 0 <= mouseY && mouseY < imgWidth * canvasScale;
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
};