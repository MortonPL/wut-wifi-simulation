class Router {
    #position;
    #powerPct;  // range: [0, 1]
    enabled;

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
}
