// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

const room = new Room(ROOM_WIDTH, ROOM_HEIGHT); // room objects
const routers = [                               // router objects
    new Router(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2), true),
    new Router(Math.floor(ROOM_WIDTH / 4), Math.floor(ROOM_HEIGHT / 4), false, Router.HIGH_FREQUENCY)
];

let materialImg;    // image object for the room layout / material layer
let wavesImg;       // image object for wave values

/**
 * Load assets.
 *
 * [This event handler is provided by p5.]
 */
function preload() {
    materialImg = loadImage('./images/material.png')
    Router.routerImg = loadImage('./images/wifi.png');
}

/**
 * Initializes all necessary data and widgets.
 *
 * [This event handler is provided by p5.]
 */
function setup() {
    // Setup the canvas
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_HEIGHT * CANVAS_SCALE).parent('sketchImage');
    noSmooth();
    canvas.imageSmoothingEnabled = false;

    // Setup the image layers
    wavesImg = createImage(ROOM_WIDTH, ROOM_WIDTH);
    materialImg = room.loadMaterial(materialImg);
}

/**
 * Move the router on mouse drag if it's close enough.
 *
 * [This event handler is provided by p5.]
 */
function mouseDragged() {
    // Find mouse position
    const mousePos = {
        x: floor(mouseX / CANVAS_SCALE),
        y: floor(mouseY / CANVAS_SCALE)
    };

    // check if mouse is inside the canvas at all
    if (!isMouseInsideCanvas())
        return;

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

/**
 * Perform all necessary calculations.
 */
function update() {
    // Check if enough time passed to process another tick (in miliseconds)
    if (Date.now() - time >= 1000 / Physics.tps) {
        time = Date.now();
        for (let i = 0; i < Physics.stepsPerTick; i++) {
            // For each enabled router, emit wave
            routers.filter(router => router.enabled)
                .forEach(router => router.update(room));
            // Propagate the waves in the room
            room.update();
            t += Physics.dt;
        }
    }
}

/**
 * Redraw the screen.
 *
 * [This event handler is provided by p5.]
 */
function draw() {
    if (!paused)
        update();

    image(materialImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    room.draw(wavesImg);
    image(wavesImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    routers.forEach(router => router.draw());
}

/**
 * Check if mouse is inside the canvas.
 * @returns {bool} If mouse is inside the canvas.
 */
function isMouseInsideCanvas() {
    return 0 <= mouseX && mouseX < ROOM_WIDTH * CANVAS_SCALE && 0 <= mouseY && mouseY < ROOM_WIDTH * CANVAS_SCALE;
}
