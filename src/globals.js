// ******************** CONSTANTS ******************** //

// GENERAL
const ROOM_WIDTH = 257;     // (int) width of the room in meters
const ROOM_HEIGHT = 257;    // (int) height of the room in meters

const MAX_VALUE = 255;                              // (int) maximum pixel value
const MAX_AMPLITUDE = Math.floor(MAX_VALUE / 2);    // (int) absolute maximum wave amplitude

// VISUALS
const CANVAS_SCALE = 2;    // (int) multiplier to pixel count per point

// CONTROLS
const ROUTER_MOVE_RANGE = 20;    // (in px) maximum distance for which the router "snaps" to mouse to move around


// ******************** VARIABLES ******************** //

let t = 0;            // (float) current simulated time
let time = 0;         // (int) timestamp of REAL time
let paused = true;    // (bool) is the simulation paused?


// ******************** FUNCTIONS ******************** //

// from: https://stackoverflow.com/a/65552876
function hexToRgb(h) { return ['0x'+h[1]+h[2]|0, '0x'+h[3]+h[4]|0, '0x'+h[5]+h[6]|0]; }
