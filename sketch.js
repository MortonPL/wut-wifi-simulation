// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;                                                 // (int) width of the room
const ROOM_HEIGHT = 257;                                                // (int) height of the room
const sourceA = [Math.floor(ROOM_WIDTH/2), Math.floor(ROOM_HEIGHT/2)];  // (point2d) starting position of the first source

// VISUALS
const CANVAS_SCALE = 2;     // (int) multiplier to pixel count per point
const COLOR_OFFSET = 127;   // (0-255) color to use as default (no wave)

// PHYSICS
const dt = 1 / 60 / stepsPerFrame;                              // (float) time step
const dx = 1 / ROOM_WIDTH;                                      // (float) width step
const dy = 1 / ROOM_HEIGHT;                                      // (float) height step
const c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;

const omega = 6;
const stepsPerFrame = 1;
const phaseVelocity = 0.1;
const alpha = 0.1;



// CONTROLS
const SOURCE_MOVE_RANGE = 20;   // (in px) maximum distance for which the source "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let img;
let u = new Array(ROOM_WIDTH); // u(t)
let u_next = new Array(ROOM_WIDTH); // u(t)
let u_prev = new Array(ROOM_WIDTH); // u(t)
let t = 0;

let paused = false;
let secondSourceEnabled = false;
let wasMousePressed = false;
const sourcePosition = [
    [128, 128],
    [10, 10]
];


function setup() {
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(ROOM_WIDTH, ROOM_WIDTH);

    createCheckbox('Paused')
        .changed(evt => paused = evt.target.checked);
    createCheckbox('Second source enabled')
        .changed(evt => secondSourceEnabled = evt.target.checked);

    for (let i = 0; i < ROOM_WIDTH; ++i) {
        u[i] = new Array(ROOM_WIDTH);
        u_next[i] = new Array(ROOM_WIDTH);
        u_prev[i] = new Array(ROOM_WIDTH);
    }

    for (let x = 0; x < ROOM_WIDTH; ++x)
        for (let y = 0; y < ROOM_WIDTH; ++y) {
            u[x][y] = 0;
            u_next[x][y] = 0;
            u_prev[x][y] = 0;
        }
}

function update() {

    for (let x = 1; x < ROOM_WIDTH - 1; ++x)
        for (let y = 1; y < ROOM_WIDTH - 1; ++y) {
            u_next[x][y] = 2 * u[x][y] - u_prev[x][y];
            u_next[x][y] += c2 * (u[x + 1][y] - 2 * u[x][y] + u[x - 1][y]);
            u_next[x][y] += c2 * (u[x][y + 1] - 2 * u[x][y] + u[x][y - 1]);
            u_next[x][y] -= alpha * dt * (u[x][y] - u_prev[x][y]);
        }

    // edges
    for (let x = 0; x < ROOM_WIDTH; ++x) {
        u_next[x][0] = u_next[x][1];
        u_next[0][x] = u_next[1][x];
        u_next[x][ROOM_WIDTH - 1] = u_next[x][ROOM_WIDTH - 2];
        u_next[ROOM_WIDTH - 1][x] = u_next[ROOM_WIDTH - 2][x];
    }

    for (let x = 0; x < ROOM_WIDTH; ++x) {
        u_prev[x] = u[x].slice();
        u[x] = u_next[x].slice();
    }
}

// event handler
// move the source on mouse press if it's close enough
function mouseDragged() {
    let draggedSourceIndex = null;
    if (isMouseInsideCanvas()) {
        let distToFirst = dist(floor(mouseX / CANVAS_SCALE), floor(mouseY / CANVAS_SCALE), sourcePosition[0][0], sourcePosition[0][1]);

        // if there are two sources, pick the closest and then check for range
        if (secondSourceEnabled) {
            let distToSecond = dist(floor(mouseX / CANVAS_SCALE), floor(mouseY / CANVAS_SCALE), sourcePosition[1][0], sourcePosition[1][1]);
            if (distToFirst < distToSecond) {
                draggedSourceIndex = distToFirst <= SOURCE_MOVE_RANGE ? 0 : null;
            } else {
                draggedSourceIndex = distToSecond <= SOURCE_MOVE_RANGE ? 1 : null;
            }
        // otherwise just check for range
        } else {
            draggedSourceIndex = distToFirst <= SOURCE_MOVE_RANGE ? 0 : null;
        }
    } else {
        draggedSourceIndex = null;
    }

    // apply position change
    if (draggedSourceIndex !== null) {
        sourcePosition[draggedSourceIndex][0] = clamp(floor(mouseX / CANVAS_SCALE), 0, ROOM_WIDTH - 1);
        sourcePosition[draggedSourceIndex][1] = clamp(floor(mouseY / CANVAS_SCALE), 0, ROOM_WIDTH - 1);
    }
}

function draw() {
    if (paused)
        return;

    for (let step = 0; step < stepsPerFrame; ++step) {
        for (let i = 0; i < 1 + Number(secondSourceEnabled); i++)
            u[sourcePosition[i][0]][sourcePosition[i][1]] = sourceA[i] * sin(omega * t);
        update();
        t += dt;
    }
    img.loadPixels();
    for (let x = 0; x < ROOM_WIDTH; ++x)
        for (let y = 0; y < ROOM_WIDTH; ++y)
            img.set(x, y, COLOR_OFFSET + u[x][y]);

    img.updatePixels();
    image(img, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}

function isMouseInsideCanvas() {
    return 0 <= mouseX && mouseX < ROOM_WIDTH * CANVAS_SCALE && 0 <= mouseY && mouseY < ROOM_WIDTH * CANVAS_SCALE;
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
};
