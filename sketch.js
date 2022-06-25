// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;  // (int) width of the room
const ROOM_HEIGHT = 257; // (int) height of the room

// VISUALS
const CANVAS_SCALE = 2;     // (int) multiplier to pixel count per point
const COLOR_OFFSET = 127;   // (0-255) color to use as default (no wave)

// PHYSICS
const OMEGA = 6;
const STEPS_PER_FRAME = 1;
const PHASE_VELOCITY = 0.1;
const ALPHA = 0.1;

const dt = 1 / 60 / STEPS_PER_FRAME;                              // (float) time step
const dx = 1 / ROOM_WIDTH;                                      // (float) width step
const dy = 1 / ROOM_HEIGHT;                                      // (float) height step
const c2 = PHASE_VELOCITY * PHASE_VELOCITY * dt * dt / dx / dy;


// CONTROLS
const SOURCE_MOVE_RANGE = 20;   // (in px) maximum distance for which the source "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let img;
let room = new Room(ROOM_WIDTH, ROOM_HEIGHT);
let t = 0;

let paused = false;
let secondSourceEnabled = false;
let wasMousePressed = false;
const sourcePosition = [
    [128, 128],
    [10, 10]
];
const sourceAmplitude = [127, 127];


function setup() {
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(ROOM_WIDTH, ROOM_WIDTH);

    createCheckbox('Paused')
        .changed(evt => paused = evt.target.checked);
    createCheckbox('Second source enabled')
        .changed(evt => secondSourceEnabled = evt.target.checked);
}

function update() {
    for (let x = 1; x < ROOM_WIDTH - 1; ++x)
        for (let y = 1; y < ROOM_WIDTH - 1; ++y) {
            let nextValue = 2 * room.getValue(x, y) - room.getLastValue(x, y);
            nextValue += c2 * (room.getValue(x + 1, y) - 2 * room.getValue(x, y) + room.getValue(x - 1, y));
            nextValue += c2 * (room.getValue(x, y + 1) - 2 * room.getValue(x, y) + room.getValue(x, y - 1));
            nextValue -= ALPHA * dt * (room.getValue(x, y) - room.getLastValue(x, y));
            room.setNextValue(x, y, nextValue);
        }

    // edges
    for (let x = 0; x < ROOM_WIDTH; ++x) {
        room.setNextValue(x, 0, room.getNextValue(x, 1));
        room.setNextValue(0, x, room.getNextValue(1, x));
        room.setNextValue(x, ROOM_WIDTH - 1, room.getNextValue(x, ROOM_WIDTH - 2));
        room.setNextValue(ROOM_WIDTH - 1, x, room.getNextValue(ROOM_WIDTH - 2, x));
    }

    room.step();
}

// event handler
// move the source on mouse press if it's close enough
function mouseDragged() {
    let draggedSourceIndex = null;
    if (isMouseInsideCanvas()) {
        let mousePos = [floor(mouseX / CANVAS_SCALE), floor(mouseY / CANVAS_SCALE)];
        let distToFirst = distToSource(0, mousePos[0], mousePos[1]);

        // if there are two sources, pick the closest and then check for range
        if (secondSourceEnabled) {
            let distToSecond = distToSource(1, mousePos[0], mousePos[1]);
            console.log(distToFirst, distToSecond);
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

function distToSource(sourceIndex, x, y) {
    if (sourceIndex < 0 || sourcePosition.length <= sourceIndex)
        return null;
    return dist(x, y, sourcePosition[sourceIndex][0], sourcePosition[sourceIndex][1]);
}

function draw() {
    if (paused)
        return;

    for (let step = 0; step < STEPS_PER_FRAME; ++step) {
        for (let i = 0; i < 1 + Number(secondSourceEnabled); i++)
            room.setValue(sourcePosition[i][0], sourcePosition[i][1], sourceAmplitude[i] * sin(OMEGA * t));
        update();
        t += dt;
    }

    room.draw(img);
    image(img, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}

function isMouseInsideCanvas() {
    return 0 <= mouseX && mouseX < ROOM_WIDTH * CANVAS_SCALE && 0 <= mouseY && mouseY < ROOM_WIDTH * CANVAS_SCALE;
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
