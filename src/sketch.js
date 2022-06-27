// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS & PSEUDOCONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;                             // (int) width of the room in meters
const ROOM_HEIGHT = 257;                            // (int) height of the room in meters
const MAX_VALUE = 255;                              // (int) maximum acceptable wave value
const MAX_AMPLITUDE = Math.floor(MAX_VALUE / 2);    // (int) absolute maximum wave amplitude

// VISUALS
const CANVAS_SCALE = 2; // (int) multiplier to pixel count per point

// PHYSICS
const dt_1 = 1e-2;                                              // (float) time step in seconds
let dt = dt_1;                                                  // (float) time step adjusted for steps per tick (default 1 step)
const PHASE_VELOCITY = 0.2;                                     // (float) phase velocity
const DAMPING_RATIO = 0.1;                                      // (float) damping ratio
const dx = 1 / ROOM_WIDTH;                                      // (float) width step
const dy = 1 / ROOM_HEIGHT;                                     // (float) height step
let c2 = PHASE_VELOCITY * PHASE_VELOCITY * dt * dt / dx / dy;   // (float) helper coefficient: v^2 multiplied by steps

// CONTROLS
const ROUTER_MOVE_RANGE = 20;  // (in px) maximum distance for which the router "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let materialImg;    // image object for the room layout / material layer
let waveImgs = [];  // image objects for wave values

const rooms = [     // room objects
    new Room(ROOM_WIDTH, ROOM_HEIGHT),
    new Room(ROOM_WIDTH, ROOM_HEIGHT),
    new Room(ROOM_WIDTH, ROOM_HEIGHT)
]; 
const routers = [   // router objects
    new Router(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2)),
    new Router(Math.floor(ROOM_WIDTH / 4), Math.floor(ROOM_HEIGHT / 4), false)
];

let t = 0;                              // (float) current simulated time
let time = 0;                           // (int) timestamp of REAL time
let tps = 60;                           // (int) ticks (updates) per second
let stepsPerTick = 1;                   // (int) steps (calculations) per tick (update)
let paused = true;                      // (bool) is the simulation paused?
let wasMousePressed = false;            // (bool) was the mouse pressed in the previous frame?
let positiveWaveColor = [255, 0, 0];    // (RGB) color of the positive values
let negativeWaveColor = [0, 0, 255];    // (RGB) color of the negative values
let showSignOnly = false;               // (bool) should we visualize only the sign of wave (as opposed to intensity)?
let currentFrequency = 0;               // (int) index of the frequency we're currently watching

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
    materialImg = rooms[0].loadMaterial(materialImg);
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
    // Check if enough time passed to process another tick (in miliseconds)
    if (Date.now() - time >= 1000 / tps) {
        time = Date.now();
        for (var j = 0; j < rooms.length; j++) {
            for (let i = 0; i < stepsPerTick; i++) {
                // For each enabled router, emit wave
                routers.filter(router => router.enabled).filter(router => router.frequencyIdx === j)
                    .forEach(router => rooms[j].setValue(router.x, router.y, router.amplitude * sin(router.frequency * t)));
                // Propagate the waves in the room
                rooms[j].update();
                //console.log(rooms[0].getValue(128, 128)); // DEBUG
                t += dt;
            }
        }
    }
}

// Draw function that redraws the screen
function draw() {
    if (!paused)
        update();

    image(materialImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    routers.forEach(router => router.draw());
    rooms[currentFrequency].draw(wavesImg);
    image(wavesImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}
