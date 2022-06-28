/**
 * Room represents a discrete 2D space as four matrices.
 *
 * Each point contains information on:
 * - electromagnetic wave amplitude (hereafter "value") in previous, current and next time step,
 * - material refraction coefficient.
 */
class Room {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.values = math.matrix(math.zeros(this.width, this.height));
        this.prevValues = math.matrix(math.zeros(this.width, this.height));
        this.nextValues = math.matrix(math.zeros(this.width, this.height));
        this.materials = math.matrix(math.ones(this.width, this.height));
    }

    getValue(x, y)            { return this.values.valueOf()[x][y];     }
    setValue(x, y, v)         { this.values.valueOf()[x][y] = v;        }
    getPrevValue(x, y)        { return this.prevValues.valueOf()[x][y]; }
    setPrevValue(x, y, v)     { this.prevValues.valueOf()[x][y] = v;    }
    getNextValue(x, y)        { return this.nextValues.valueOf()[x][y]; }
    setNextValue(x, y, v)     { this.nextValues.valueOf()[x][y] = v;    }
    getMaterialValue(x, y)    { return this.materials.valueOf()[x][y];  }
    setMaterialValue(x, y, v) { this.materials.valueOf()[x][y] = v;     }

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
        for (let x = 0; x < img.width; ++x) {
            for (let y = 0; y < img.height; ++y) {
                let pixelIndex = (y * img.width + x) * 4;
                this.setMaterialValue(x, y, 1 - img.pixels[pixelIndex] / MAX_VALUE);
            }
        }

        return img;
    }

    /**
     * Reset simulation values.
     */
    clean() {
        this.values = math.matrix(math.zeros(this.width, this.height));
        this.prevValues = math.matrix(math.zeros(this.width, this.height));
        this.nextValues = math.matrix(math.zeros(this.width, this.height));
    }

    /**
     * Update self, progressing by a time step.
     */
    update() {
        for (let x = 1; x < this.width - 1; ++x)
            for (let y = 1; y < this.height - 1; ++y) {
                // Consider value at point
                let nextValue = 2 * this.getValue(x, y) - this.getPrevValue(x, y);
                // Consider refraction and c^2 coefficient
                let coeffs = 1 / (1 + globalRefractionModifier * this.getMaterialValue(x, y)) * c2;
                // Consider 4 neighbours
                nextValue += coeffs * (this.getValue(x + 1, y) - 2 * this.getValue(x, y) + this.getValue(x - 1, y));
                nextValue += coeffs * (this.getValue(x, y + 1) - 2 * this.getValue(x, y) + this.getValue(x, y - 1));
                // Consider damping
                nextValue -= damping * dt * (this.getValue(x, y) - this.getPrevValue(x, y));
                this.setNextValue(x, y, nextValue);
            }

        // Edges - border values are copies of neighbours closer to the center
        for (let x = 0; x < this.width; ++x) {
            this.setNextValue(x, 0, this.getNextValue(x, 1));
            this.setNextValue(x, this.height - 1, this.getNextValue(x, this.height - 2));
        }
        for (let y = 0; y < this.height; ++y) {
            this.setNextValue(0, y, this.getNextValue(1, y));
            this.setNextValue(this.width - 1, y, this.getNextValue(this.width - 2, y));
        }

        // Shift values - now becomes previous, next becomes now
        this.prevValues = this.values.clone();
        this.values = this.nextValues.clone();
    }

    /**
     * Draw self.
     *
     * Color depends on the sign and alpha level depends on the modulus of current value.
     */
    draw(img) {
        img.loadPixels();
        this.values.forEach((v, [x, y], _) => {
            let pixelIndex = (y * img.width + x) * 4;

            // color
            let resultColor = v >= 0 ? positiveWaveColor : negativeWaveColor;
            img.pixels[pixelIndex] = resultColor[0];
            img.pixels[pixelIndex + 1] = resultColor[1];
            img.pixels[pixelIndex + 2] = resultColor[2];

            // alpha
            v = abs(v);  // get the absolute value
            const magicMultiplier = 4;  // scale values for better visibility (too large values are clamped by p5, so there's no problem)
            if (showSignOnly)
                v = v >= 0.1 ? (MAX_AMPLITUDE / magicMultiplier) : 0; // make color half-transparent for all non-zero values
            img.pixels[pixelIndex + 3] = v * magicMultiplier;
        });
        img.updatePixels();
    }
}
