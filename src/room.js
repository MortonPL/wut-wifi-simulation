/**
 * Room represents a discrete 2D space as four matrices.
 *
 * Each point contains information on:
 * - electromagnetic wave amplitude (hereafter "value") in previous, current and next time step,
 * - material refraction coefficient.
 */
class Room {
    static positiveWaveColor = [255, 0, 0];  // (RGB) color for positive amplitudes
    static negativeWaveColor = [0, 0, 255];  // (RGB) color for negative amplitudes
    static showSignOnly = false;             // (bool) should we visualize only the sign of wave (as opposed to intensity)?

    #prevValues;
    #values;
    #nextValues;
    #refractionCoeffs;

    /**
     * @param {number} width Vertical room size (non-negative integer).
     * @param {number} height Horizontal room size (non-negative integer).
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.clean();
        this.#refractionCoeffs = math.matrix(math.ones(this.width, this.height));
    }

    setValue(x, y, v) { this.#values.valueOf()[x][y] = v; }

    /**
     * Load a refraction coefficient matrix from grayscale image.
     * @param {p5.Image} img The loaded image. It is rescaled in process, so you should provide a copy
     *     if you want to keep the original intact.
     * @returns {p5.Image} Rescaled and padded image which corresponds to the matrix contents.
     */
    loadMaterial(img) {
        // Resize to fit using nearest-neighbour scaling,
        // which preserves original, non-interpolated color values
        let original = img;
        img = createImage(this.width, this.height);
        img.loadPixels();
        for (let x = 0; x < img.width; ++x) {
            for (let y = 0; y < img.height; ++y) {
                let pixelIndex = (y * img.width + x) * 4;
                img.pixels[pixelIndex] = img.pixels[pixelIndex + 1] = img.pixels[pixelIndex + 2] = MAX_VALUE;  // RGB (white)
                img.pixels[pixelIndex + 3] = MAX_VALUE;  // alpha (fully visible)
            }
        }
        img.updatePixels();
        if (this.width / this.height < original.width / original.height)
            original.resizeNN(this.width, 0);
        else
            original.resizeNN(0, this.height);
        img.copy(original, 0, 0, original.width, original.height,
            floor((this.width - original.width) / 2), floor((this.height - original.height) / 2),
            original.width, original.height);

        // Place transformed values in the refraction coefficient matrix
        // (the darker a pixel, the denser material represented by a corresponding coefficient)
        img.loadPixels();
        let refractionCoeffs = this.#refractionCoeffs.valueOf();
        for (let x = 0; x < img.width; ++x) {
            for (let y = 0; y < img.height; ++y) {
                let pixelIndex = (y * img.width + x) * 4;
                refractionCoeffs[x][y] = 1 - img.pixels[pixelIndex] / MAX_VALUE;
                // Make the result image grayscale even if it originally was RGB
                img.pixels[pixelIndex + 1] = img.pixels[pixelIndex + 2] = img.pixels[pixelIndex];
            }
        }
        img.updatePixels();

        return img;
    }

    /**
     * Reset simulation values.
     */
    clean() {
        this.#prevValues = math.matrix(math.zeros(this.width, this.height));
        this.#values = math.matrix(math.zeros(this.width, this.height));
        this.#nextValues = math.matrix(math.zeros(this.width, this.height));
    }

    /**
     * Update self, progressing by a time step.
     */
    update() {
        // Cache direct references to contents of matrices
        let prevValues = this.#prevValues.valueOf();
        let values = this.#values.valueOf();
        let nextValues = this.#nextValues.valueOf();
        let refractionCoeffs = this.#refractionCoeffs.valueOf();

        for (let x = 1; x < this.width - 1; ++x)
            for (let y = 1; y < this.height - 1; ++y) {
                // Consider value at point
                nextValues[x][y] = 2 * values[x][y] - prevValues[x][y];
                // Consider refraction and c^2 coefficient
                let coeffs = 1 / (1 + Physics.globalRefractionModifier * refractionCoeffs[x][y]) * Physics.c2;
                // Consider 4 neighbours
                nextValues[x][y] += coeffs * (values[x + 1][y] - 2 * values[x][y] + values[x - 1][y]);
                nextValues[x][y] += coeffs * (values[x][y + 1] - 2 * values[x][y] + values[x][y - 1]);
                // Consider damping
                nextValues[x][y] -= Physics.damping * Physics.dt * (values[x][y] - prevValues[x][y]);
            }

        // Edges - border values are copies of neighbours closer to the center
        for (let x = 0; x < this.width; ++x) {
            nextValues[x][0] = nextValues[x][1];
            nextValues[x][this.height - 1] = nextValues[x][this.height - 2];
        }
        for (let y = 0; y < this.height; ++y) {
            nextValues[0][y] = nextValues[1][y];
            nextValues[this.width - 1][y] = nextValues[this.width - 2][y];
        }

        this.#shiftMatrices();
    }

    /**
     * Shift values: now becomes previous, next becomes now.
     */
    #shiftMatrices() {
        this.#prevValues = this.#values;
        this.#values = this.#nextValues;
        this.#nextValues = math.matrix(math.zeros(this.width, this.height));
    }

    /**
     * Draw self.
     *
     * Color depends on the sign and alpha level depends on the modulus of current value.
     */
    draw(img) {
        img.loadPixels();
        this.#values.forEach((v, [x, y], _) => {
            let pixelIndex = (y * img.width + x) * 4;

            // color
            let resultColor = v >= 0 ? Room.positiveWaveColor : Room.negativeWaveColor;
            img.pixels[pixelIndex] = resultColor[0];
            img.pixels[pixelIndex + 1] = resultColor[1];
            img.pixels[pixelIndex + 2] = resultColor[2];

            // alpha
            v = abs(v);  // get the absolute value
            const magicMultiplier = 4;  // scale values for better visibility (too large values are clamped by p5, so there's no problem)
            if (Room.showSignOnly)
                v = v >= 0.1 ? (MAX_AMPLITUDE / magicMultiplier) : 0;  // make color half-transparent for all non-zero values
            img.pixels[pixelIndex + 3] = v * magicMultiplier;
        });
        img.updatePixels();
    }
}
