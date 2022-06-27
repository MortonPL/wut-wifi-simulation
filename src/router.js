/* Router represents a point source of waves.
 * Router can have changing position and can be enabled/disabled.
 */
class Router {
    static LOW_FREQUENCY = 2.4e9;
    static HIGH_FREQUENCY = 5e9;
    #position;
    #powerPct;  // range: [0, 1]
    enabled;
    frequency = 2.4e9;
    static routerImg;

    constructor(x, y, enabled = true, powerPct = 1.0) {
        if (powerPct === null)
            powerPct = 1.0;
        this.#position = [x, y];
        this.#validatePowerPct(powerPct);
        this.#powerPct = powerPct;
        this.enabled = enabled;
    }

    #validatePowerPct(value) {
        if (typeof(value) !== 'number')
            throw new TypeError();
        if (value < 0 || value > 1)
            throw new RangeError();
    }

    get x() { return this.#position[0]; }
    set x(value) { this.#position[0] = value; }

    get y() { return this.#position[1]; }
    set y(value) { this.#position[1] = value; }

    get powerPct() { return this.#powerPct; }
    set powerPct(value) {
        this.#validatePowerPct(powerPct);
        this.#powerPct = value;
    }

    get amplitude() { return this.#powerPct * MAX_AMPLITUDE; }

    // Draw self
    draw(img = null) {
        if (this.enabled)
            // Offset so that the bottom middle of the image is at the router's center
            image(Router.routerImg, this.#position[0]*CANVAS_SCALE - 15, this.#position[1]*CANVAS_SCALE - 20, 32, 24);
    }
}
