class Physics {
    static #tps = 60;
    static #stepsPerTick = 1;
    static #dt = Physics.dt_1 / Physics.#stepsPerTick;
    static #phaseVelocity = 0.2;
    static #damping = 0.25;
    static #c2 = Physics.#phaseVelocity * Physics.#phaseVelocity * Physics.#dt * Physics.#dt / Physics.dx / Physics.dy;
    static #globalRefractionModifier = 2.5;

    static #updateDependent() {
        Physics.#dt = Physics.dt_1 / Physics.#stepsPerTick;
        Physics.#c2 = Physics.#phaseVelocity * Physics.#phaseVelocity * Physics.#dt * Physics.#dt / Physics.dx / Physics.dy;
    }

    /**
     * Time step in seconds.
     * @type {number} Positive real.
     */
    static get dt_1() { return 1e-2; }

    /**
     * Ticks (updates) per second.
     * @type {number} Positive integer.
     */
    static get tps() { return Physics.#tps; }
    static set tps(value) { Physics.#tps = value; }

    /**
     * Steps (calculations) per tick.
     * @type {number} Positive integer.
     * @see {@link tps}
     */
    static get stepsPerTick() { return Physics.#stepsPerTick; }
    static set stepsPerTick(value) {
        Physics.#stepsPerTick = value;
        Physics.#updateDependent();
    }

    /**
     * Time step adjusted for steps per tick (default 1 step).
     * @type {number} Positive real.
     * @see {@link stepsPerTick}
     */
    static get dt() { return Physics.#dt; }

    /**
     * Phase velocity.
     * @type {number} Positive real.
     */
    static get phaseVelocity() { return Physics.#phaseVelocity; }
    static set phaseVelocity(value) {
        Physics.#phaseVelocity = value;
        Physics.#updateDependent();
    }

    /**
     * Damping ratio (alpha).
     * @type {number} Positive real.
     */
    static get damping() { return Physics.#damping; }
    static set damping(value) { Physics.#damping = value; }

    /**
     * Horizontal step.
     * @type {number} Positive real.
     */
    static get dx() { return 1 / ROOM_WIDTH; }

    /**
     * Vertical step.
     * @type {number} Positive real.
     */
    static get dy() { return 1 / ROOM_HEIGHT; }

    /**
     * Helper coefficient c^2: v^2 multiplied by steps.
     * @type {number} Positive real.
     */
    static get c2() { return Physics.#c2; }

    /**
     * Magic multiplier to material refraction index.
     * @type {number} Positive real.
     */
    static get globalRefractionModifier() { return Physics.#globalRefractionModifier; }
    static set globalRefractionModifier(value) { Physics.#globalRefractionModifier = value; }
}
