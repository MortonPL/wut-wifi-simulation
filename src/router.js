/**
 * Router represents a point source of waves.
 *
 * Router can be enabled/disabled and moved in 2D space.
 * Its power and frequency can be changed.
 */
class Router {
    static LOW_FREQUENCY = 2.4;
    static HIGH_FREQUENCY = 5;
    static routerImg;

    static #frequencyUnitMultiplier = 10;

    enabled;
    frequency = 2.4;

    #position;
    #powerPct;

    /**
     * @param {number} x Initial vertical position (non-negative integer).
     * @param {number} y Initial horizontal position (non-negative integer).
     * @param {number} frequency Initial frequency (in GHz, positive number).
     * @param {number} powerPct Initial power level (in range [0; 1]).
     */
    constructor(x, y, enabled = true, frequency = Router.LOW_FREQUENCY, powerPct = 1.0) {
        if (powerPct === null)
            powerPct = 1.0;
        this.#position = [x, y];
        this.#validatePowerPct(powerPct);
        this.#powerPct = powerPct;
        this.enabled = enabled;
        this.frequency = frequency;
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

    /**
     * Power percentage (in range [0; 1]).
     * @type {number}
     */
    get powerPct() { return this.#powerPct; }
    set powerPct(value) {
        this.#validatePowerPct(value);
        this.#powerPct = value;
    }

    /**
     * Max amplitude (unaffected by time).
     * @type {number}
     */
    get amplitude() { return this.#powerPct * MAX_AMPLITUDE; }

    /**
     * Update self.
     */
    update(room) {
        room.setValue(this.x, this.y, this.amplitude * sin(this.frequency * Router.#frequencyUnitMultiplier * t))
    }

    /**
     * Draw self.
     */
    draw() {
        if (this.enabled)
            // Center the image in the position of router
            image(Router.routerImg,
                round(this.x * CANVAS_SCALE - Router.routerImg.width / 2) + 1,
                round(this.y * CANVAS_SCALE - Router.routerImg.height / 2) + 1,
                Router.routerImg.width, Router.routerImg.height);
    }
}
