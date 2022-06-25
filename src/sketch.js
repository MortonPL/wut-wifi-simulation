// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;  // (int) width of the room
const ROOM_HEIGHT = 257; // (int) height of the room

// VISUALS
const CANVAS_SCALE = 2;    // (int) multiplier to pixel count per point
const COLOR_OFFSET = 127;  // (0-255) color to use as default (no wave)

// PHYSICS
const OMEGA = 6;
const STEPS_PER_FRAME = 1;
const PHASE_VELOCITY = 0.1;
const ALPHA = 0.1;

const dt = 1 / 60 / STEPS_PER_FRAME;  // (float) time step
const dx = 1 / ROOM_WIDTH;   // (float) width step
const dy = 1 / ROOM_HEIGHT;  // (float) height step
const c2 = PHASE_VELOCITY * PHASE_VELOCITY * dt * dt / dx / dy;


// CONTROLS
const ROUTER_MOVE_RANGE = 20;  // (in px) maximum distance for which the router "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let img;
const room = new Room(ROOM_WIDTH, ROOM_HEIGHT);
const routers = [
    new Router(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2)),
    new Router(Math.floor(ROOM_WIDTH / 4), Math.floor(ROOM_HEIGHT / 4), false)
];
let t = 0;

let paused = false;
let wasMousePressed = false;


function setup() {
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    noSmooth();
    canvas.imageSmoothingEnabled = false;
    img = createImage(ROOM_WIDTH, ROOM_WIDTH);

    createCheckbox('Paused')
        .changed(evt => paused = evt.target.checked);
    createCheckbox('Second router enabled')
        .changed(evt => routers[1].enabled = evt.target.checked);
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

    for (let step = 0; step < STEPS_PER_FRAME; ++step) {
        routers.filter(router => router.enabled)
            .forEach(router => room.setValue(router.x, router.y, router.amplitude * sin(OMEGA * t)));
        update();
        t += dt;
    }

    room.draw(img);
    image(img, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}
