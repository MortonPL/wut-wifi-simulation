// based on: https://editor.p5js.org/tomgrad/sketches/FuxTD-Qr_

// ******************** GLOBAL CONSTANTS ******************** //
// GENERAL
const ROOM_WIDTH = 257;                             // (int) width of the room
const ROOM_HEIGHT = 257;                            // (int) height of the room
const MAX_VALUE = 255;                              // (int) maximum acceptable wave value
const MAX_AMPLITUDE = Math.floor(MAX_VALUE / 2);    // (int) absolute maximum wave amplitude

// VISUALS
const CANVAS_SCALE = 2;                     // (int) multiplier to pixel count per point
const POSITIVE_WAVE_COLOR = [255, 0, 0];    // (RGB) color of the positive values
const NEGATIVE_WAVE_COLOR = [0, 0, 255];    // (RGB) color of the negative values

// PHYSICS
const dt = 1 / 60;                                              // (float) time step
const OMEGA = 6;                                                // ???
const PHASE_VELOCITY = 0.1;                                     // ???
const ALPHA = 0.1;                                              // ???
const dx = 1 / ROOM_WIDTH;                                      // (float) width step
const dy = 1 / ROOM_HEIGHT;                                     // (float) height step
const c2 = PHASE_VELOCITY * PHASE_VELOCITY * dt * dt / dx / dy; // ???

// CONTROLS
const ROUTER_MOVE_RANGE = 20;  // (in px) maximum distance for which the router "snaps" to mouse to move around

// ******************** GLOBAL VARIABLES ******************** //
let materialImg;    // image object for the room layout / material layer
let wavesImg;       // image object for the wave layer

const room = new Room(ROOM_WIDTH, ROOM_HEIGHT); // room object
const routers = [                               // router objects
    new Router(Math.floor(ROOM_WIDTH / 2), Math.floor(ROOM_HEIGHT / 2)),
    new Router(Math.floor(ROOM_WIDTH / 4), Math.floor(ROOM_HEIGHT / 4), false)
];

let t = 0;                      // (float) current simulated time
let time = 0;                   // (int) timestamp of REAL time
let tps = 60;                   // (int) ticks (updates) per second
let stepsPerTick = 1;           // (int) steps (calculations) per tick (update)
let paused = false;             // (bool) is the simulation paused?
let wasMousePressed = false;    // (bool) was the mouse pressed in the previous frame?

// ******************** FUNCTIONS ******************** //
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
    createCanvas(ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
    noSmooth();
    canvas.imageSmoothingEnabled = false;

    // Setup the image layers
    wavesImg = createImage(ROOM_WIDTH, ROOM_WIDTH);
    materialImg = room.loadMaterial(materialImg);

    // Setup widgets
    // Checkboxes
    createCheckbox('Paused', false)
        .changed(evt => paused = evt.target.checked);
    createCheckbox('First router enabled', true)
        .changed(evt => routers[0].enabled = evt.target.checked);
    createCheckbox('Second router enabled', false)
        .changed(evt => routers[1].enabled = evt.target.checked);
    // Ticks per second slider
    var tpsSlider = createSlider(1, 60, 60)
        .input(evt => {
            tps = evt.target.value;
        })
    var tpsSliderName = createDiv('Ticks per second (1-60)');
    tpsSlider.parent(tpsSliderName);
    // Steps per tick slider
    var stepsPerTickSlider = createSlider(1, 10, 1)
    .input(evt => {
        stepsPerTick = evt.target.value;
    })
    var stepsPerTickSliderName = createDiv('Steps per tick (1-10)');
    stepsPerTickSlider.parent(stepsPerTickSliderName);
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
        for (let i = 0; i < stepsPerTick; i++) {
            // For each enabled router, emit wave
            routers.filter(router => router.enabled)
                .forEach(router => room.setValue(router.x, router.y, router.amplitude * sin(OMEGA * t)));
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
    routers.forEach(router => router.draw());
    room.draw(wavesImg);
    image(wavesImg, 0, 0, ROOM_WIDTH * CANVAS_SCALE, ROOM_WIDTH * CANVAS_SCALE);
}
