/* Room represents a discrete 2D space as four matrices containing:
 * - value at point
 * - previous value at point
 * - next value at point
 * - refraction coefficient
 */
class Room {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.values = math.matrix(math.zeros(this.width, this.height));
        this.lastValues = math.matrix(math.zeros(this.width, this.height));
        this.nextValues = math.matrix(math.zeros(this.width, this.height));
        this.materials = math.matrix(math.ones(this.width, this.height));
    }

    getValue(x, y)            { return this.values.valueOf()[x][y];     }
    setValue(x, y, v)         { this.values.valueOf()[x][y] = v;        }
    getLastValue(x, y)        { return this.lastValues.valueOf()[x][y]; }
    setLastValue(x, y, v)     { this.lastValues.valueOf()[x][y] = v;    }
    getNextValue(x, y)        { return this.nextValues.valueOf()[x][y]; }
    setNextValue(x, y, v)     { this.nextValues.valueOf()[x][y] = v;    }
    getMaterialValue(x, y)    { return this.materials.valueOf()[x][y];  }
    setMaterialValue(x, y, v) { this.materials.valueOf()[x][y] = v;     }

    // TODO: replace random numbers with actually meaningful data???
    get AIR_COEFF() { return 1; }
    get WINDOW_COEFF() { return 4; }
    get WALL_COEFF() { return 3; }
    get DOOR_COEFF() { return 2; }

    // TODO: commets explaining what's happening
    loadMaterial(img) {
        // Resize to fit
        let original = img;
        img = createImage(this.width, this.height);
        for (let x = 0; x < img.width; ++x) {
            for (let y = 0; y < img.height; ++y) {
                img.set(x, y, color(MAX_VALUE));
            }
        }
        if (this.width / this.height < original.width / original.height)
            original.resizeNN(this.width, 0);
        else
            original.resizeNN(0, this.height);
        img.copy(original, 0, 0, original.width, original.height,
            floor((this.width - original.width) / 2), floor((this.height - original.height) / 2),
            original.width, original.height);

        // Copy values
        for (let x = 0; x < img.width; ++x) {
            for (let y = 0; y < img.height; ++y) {
                this.setMaterialValue(x, y, 1 + 4 * (1 - img.get(x, y)[0] / MAX_VALUE));
            }
        }

        return img;
    }

    // Update self, progress by a time step
    // TODO: commets explaining what's happening
    update() {
        for (let x = 1; x < this.width - 1; ++x)
            for (let y = 1; y < this.height - 1; ++y) {
                let nextValue = 2 * this.getValue(x, y) - this.getLastValue(x, y);
                nextValue += 1 / this.getMaterialValue(x, y) * c2 * (this.getValue(x + 1, y) - 2 * this.getValue(x, y) + this.getValue(x - 1, y));
                nextValue += 1 / this.getMaterialValue(x, y) * c2 * (this.getValue(x, y + 1) - 2 * this.getValue(x, y) + this.getValue(x, y - 1));
                nextValue -= ALPHA * dt * (this.getValue(x, y) - this.getLastValue(x, y));
                this.setNextValue(x, y, nextValue);
            }

        // Edges
        for (let x = 0; x < this.width; ++x) {
            this.setNextValue(x, 0, this.getNextValue(x, 1));
            this.setNextValue(x, this.height - 1, this.getNextValue(x, this.height - 2));
        }
        for (let y = 0; y < this.height; ++y) {
            this.setNextValue(0, y, this.getNextValue(1, y));
            this.setNextValue(this.width - 1, y, this.getNextValue(this.width - 2, y));
        }

        this.lastValues = this.values.clone();
        this.values = this.nextValues.clone();
        this.nextValues = math.zeros(this.width, this.height);
    }

    // Draw self, color depends on the sign of current value
    draw(img) {
        img.loadPixels();
        this.values.forEach((v, i, _) => {
            if (v >= 0)
                img.set(i[0], i[1], color(POSITIVE_WAVE_COLOR[0], POSITIVE_WAVE_COLOR[1], POSITIVE_WAVE_COLOR[2], v*2))
            else
                img.set(i[0], i[1], color(NEGATIVE_WAVE_COLOR[0], NEGATIVE_WAVE_COLOR[1], NEGATIVE_WAVE_COLOR[2], -v*2))
        });
        img.updatePixels();
    }
}
