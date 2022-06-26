// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;  // (int) width of the room
const ROOM_HEIGHT = 257; // (int) height of the room

// VISUALS
const CANVAS_SCALE = 2;    // (int) multiplier to pixel count per point
const WAVE_COLOR = [255, 0, 0];

// PHYSICS
const OMEGA = 6;
const STEPS_PER_FRAME = 1;
const PHASE_VELOCITY = 0.1;
const ALPHA = 0.1;
const MAX_VALUE = 255;

const MAX_AMPLITUDE = Math.floor(MAX_VALUE / 2);
const dt = 1 / 60 / STEPS_PER_FRAME;  // (float) time step
const dx = 1 / ROOM_WIDTH;   // (float) width step
const dy = 1 / ROOM_HEIGHT;  // (float) height step
const c2 = PHASE_VELOCITY * PHASE_VELOCITY * dt * dt / dx / dy;


// CONTROLS
const ROUTER_MOVE_RANGE = 20;  // (in px) maximum distance for which the router "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let materialImg;
let wavesImg;
const room = new Room(ROOM_WIDTH, ROOM_HEIGHT);
const routers = [
    new Router(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2)),
    new Router(Math.floor(ROOM_WIDTH / 4), Math.floor(ROOM_HEIGHT / 4), false)
];
let t = 0;

let paused = false;
let wasMousePressed = false;


function preload() {
    materialImg = loadImage('../material.png');
}

function setup() {
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    noSmooth();
    canvas.imageSmoothingEnabled = false;

    wavesImg = createImage(ROOM_WIDTH, ROOM_WIDTH);
    materialImg = room.loadMaterial(materialImg);

    createCheckbox('Paused')
        .changed(evt => paused = evt.target.checked);
    createCheckbox('Second router enabled')
        .changed(evt => routers[1].enabled = evt.target.checked);
}

// event handler
// move the router on mouse drag if it's close enough
function mouseDragged() {
    const mousePos = {
        x: floor(mouseX / CANVAS_SCALE),
        y: floor(mouseY / CANVAS_SCALE)
    };

    let enabledRouters = routers.filter(router => router.enabled)
        .map(router => ({
            router: router,
            dist: dist(router.x, router.y, mousePos.x, mousePos.y)
        }));
    enabledRouters.sort((a, b) => a.dist - b.dist);

    const routersInMoveRange = enabledRouters.filter(distRouter => distRouter.dist <= ROUTER_MOVE_RANGE)
        .map(distRouter => distRouter.router);
    if (routersInMoveRange.length > 0) {
        // apply position change
        const draggedRouter = routersInMoveRange[0];
        draggedRouter.x = constrain(mousePos.x, 0, ROOM_WIDTH - 1);
        draggedRouter.y = constrain(mousePos.y, 0, ROOM_HEIGHT - 1);
    }
}

function draw() {
    if (paused)
        return;

    background(MAX_VALUE);

    for (let step = 0; step < STEPS_PER_FRAME; ++step) {
        routers.filter(router => router.enabled)
            .forEach(router => room.setValue(router.x, router.y, router.amplitude * sin(OMEGA * t)));
        room.update();
        t += dt;
    }

    image(materialImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    room.draw(wavesImg);
    image(wavesImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}
