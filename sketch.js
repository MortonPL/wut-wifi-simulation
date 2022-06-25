// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

const canvasScale = 2;
const centerPix = 128;
const imgWidth = 2 * centerPix + 1;

const sourceA = 127;
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


function setup() {
    createCanvas(imgWidth * canvasScale, imgWidth * canvasScale);
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(imgWidth, imgWidth);

    createButton('Pause')
        .mousePressed(() => paused = true);
    createButton('Unpause')
        .mousePressed(() => paused = false);

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

function draw() {
    if (paused)
        return;

    for (let step = 0; step < stepsPerFrame; ++step) {
        u[centerPix][centerPix] = sourceA * sin(omega * t);
        update()
        t += dt;
    }
    img.loadPixels();
    for (let x = 0; x < imgWidth; ++x)
        for (let y = 0; y < imgWidth; ++y)
            img.set(x, y, 127 + u[x][y]);

    img.updatePixels();
    image(img, 0, 0, imgWidth * canvasScale, imgWidth * canvasScale);
}