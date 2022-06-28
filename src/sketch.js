// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS & PSEUDOCONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;                             // (int) width of the room in meters
const ROOM_HEIGHT = 257;                            // (int) height of the room in meters
const MAX_VALUE = 255;                              // (int) maximum acceptable wave value
const MAX_AMPLITUDE = Math.floor(MAX_VALUE / 2);    // (int) absolute maximum wave amplitude
let tps = 60;                                       // (int) ticks (updates) per second
let stepsPerTick = 1;                               // (int) steps (calculations) per tick (update)

// VISUALS
const CANVAS_SCALE = 2;                 // (int) multiplier to pixel count per point
let positiveWaveColor = [255, 0, 0];    // (RGB) color of the positive values
let negativeWaveColor = [0, 0, 255];    // (RGB) color of the negative values

// PHYSICS
const dt_1 = 1e-2;                                              // (float) time step in seconds
let dt = dt_1 / stepsPerTick;                                   // (float) time step adjusted for steps per tick (default 1 step)
let phaseVelocity = 0.2;                                        // (float) phase velocity
let damping = 0.25;                                             // (float) damping
const dx = 1 / ROOM_WIDTH;                                      // (float) width step
const dy = 1 / ROOM_HEIGHT;                                     // (float) height step
let c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;     // (float) helper coefficient: v^2 multiplied by steps
let globalRefractionModifier = 2.5;                             // (float) multiplier to material refraction index

// CONTROLS
const ROUTER_MOVE_RANGE = 20;  // (in px) maximum distance for which the router "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let materialImg;    // image object for the room layout / material layer
let waveImg;        // image object for wave values

const room = new Room(ROOM_WIDTH, ROOM_HEIGHT); // room objects
const routers = [                               // router objects
    new Router(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2), true),
    new Router(Math.floor(ROOM_WIDTH / 4), Math.floor(ROOM_HEIGHT / 4), false, Router.HIGH_FREQUENCY)
];

let t = 0;                              // (float) current simulated time
let time = 0;                           // (int) timestamp of REAL time
let paused = true;                      // (bool) is the simulation paused?
let showSignOnly = false;               // (bool) should we visualize only the sign of wave (as opposed to intensity)?

// ******************** FUNCTIONS ******************** //
// from: https://stackoverflow.com/a/65552876
function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}

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
    // Setup the canvas
    var canvas = createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_HEIGHT * CANVAS_SCALE);
    canvas.parent('sketchImage');
    noSmooth();
    canvas.imageSmoothingEnabled = false;

    // Setup the image layers
    wavesImg = createImage(ROOM_WIDTH, ROOM_WIDTH);
    materialImg = room.loadMaterial(materialImg);
}

// Event handler
// Move the router on mouse drag if it's close enough
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

// Update function that contains all calculations
function update() {
    // Check if enough time passed to process another tick (in miliseconds)
    if (Date.now() - time >= 1000 / tps) {
        time = Date.now();
        for (let i = 0; i < stepsPerTick; i++) {
            // For each enabled router, emit wave
            routers.filter(router => router.enabled)
                .forEach(router => router.update(room));
            // Propagate the waves in the room
            room.update();
            t += dt;
        }
    }
}

// Draw function that redraws the screen
function draw() {
    if (!paused)
        update();

    image(materialImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    room.draw(wavesImg);
    image(wavesImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    routers.forEach(router => router.draw());
}

function isMouseInsideCanvas() {
    return 0 <= mouseX && mouseX < ROOM_WIDTH * CANVAS_SCALE && 0 <= mouseY && mouseY < ROOM_WIDTH * CANVAS_SCALE;
}
