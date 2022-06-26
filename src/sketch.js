// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;  // (int) width of the room
const ROOM_HEIGHT = 257; // (int) height of the room

// VISUALS
const CANVAS_SCALE = 2;    // (int) multiplier to pixel count per point
const POSITIVE_WAVE_COLOR = [255, 0, 0];
const NEGATIVE_WAVE_COLOR = [0, 0, 255];

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

// Preload function that loads and caches assets (images)
function preload() {
    let a = new AssetCache();

    a.cacheImage('material.png');
    a.cacheImage('wifi.png');

    materialImg = a.getImage('material.png');
    Router.routerImg = a.getImage('wifi.png');
}

// Setup function that initializes all necessary data and widgets
function setup() {
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    noSmooth();
    canvas.imageSmoothingEnabled = false;

    wavesImg = createImage(ROOM_WIDTH, ROOM_WIDTH);
    materialImg = room.loadMaterial(materialImg);

    createCheckbox('Paused', false)
        .changed(evt => paused = evt.target.checked);
    createCheckbox('First router enabled', true)
        .changed(evt => routers[0].enabled = evt.target.checked);
    createCheckbox('Second router enabled', false)
        .changed(evt => routers[1].enabled = evt.target.checked);
}

// Event handler
// Move the router on mouse drag if it's close enough
function mouseDragged() {
    // Find mouse position
    const mousePos = {
        x: floor(mouseX / CANVAS_SCALE),
        y: floor(mouseY / CANVAS_SCALE)
    };

    // Find enabled routers and their distance from mouse
    let enabledRouters = routers.filter(router => router.enabled)
        .map(router => ({
            router: router,
            dist: dist(router.x, router.y, mousePos.x, mousePos.y)
        }));
    enabledRouters.sort((a, b) => a.dist - b.dist);

    // Only consider routers close enough to the mouse
    const routersInMoveRange = enabledRouters.filter(distRouter => distRouter.dist <= ROUTER_MOVE_RANGE)
        .map(distRouter => distRouter.router);
    if (routersInMoveRange.length > 0) {
        // Apply position change
        const draggedRouter = routersInMoveRange[0];
        draggedRouter.x = constrain(mousePos.x, 0, ROOM_WIDTH - 1);
        draggedRouter.y = constrain(mousePos.y, 0, ROOM_HEIGHT - 1);
    }
}

// Update function that contains all calculations
function update() {
    for (let step = 0; step < STEPS_PER_FRAME; ++step) {
        routers.filter(router => router.enabled)
            .forEach(router => room.setValue(router.x, router.y, router.amplitude * sin(OMEGA * t)));
        room.update();
        t += dt;
    }
}

// Draw function that redraws the screen
function draw() {
    if (!paused)
        update();

    background(MAX_VALUE);

    image(materialImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    routers.forEach(router => router.draw());
    room.draw(wavesImg);
    image(wavesImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}
