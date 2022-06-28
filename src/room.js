/* Room represents a discrete 2D space as four matrices containing:
 * - value at point
 * - previous value at point
 * - next value at point
 * - refraction coefficient at point
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

    // TODO: comments explaining what's happening
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
                this.setMaterialValue(x, y, 1 + 2.5 * (1 - img.get(x, y)[0] / MAX_VALUE));
            }
        }

        return img;
    }

    // reset simulation values
    clean() {
        this.values = math.matrix(math.zeros(this.width, this.height));
        this.prevValues = math.matrix(math.zeros(this.width, this.height));
        this.nextValues = math.matrix(math.zeros(this.width, this.height));
    }

    // Update self, progress by a time step
    update() {
        for (let x = 1; x < this.width - 1; ++x)
            for (let y = 1; y < this.height - 1; ++y) {
                // Consider value at point
                let nextValue = 2 * this.getValue(x, y) - this.getPrevValue(x, y);
                // Consider refraction and c^2 coefficient
                let temp = 1 / this.getMaterialValue(x, y) * c2;
                // Consider 4 neighbours
                nextValue += temp * (this.getValue(x + 1, y) - 2 * this.getValue(x, y) + this.getValue(x - 1, y));
                nextValue += temp * (this.getValue(x, y + 1) - 2 * this.getValue(x, y) + this.getValue(x, y - 1));
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

    // Draw self, color depends on the sign of current value
    draw(img) {
        img.loadPixels();
        this.values.forEach((v, i, _) => {
            if (showSignOnly)
                v = v >= 0.1 ? 32 : v <= -0.1 ? -32 : 0; // make color half-transparent for all non-zero values
            if (v >= 0)
                img.set(i[0], i[1], color(positiveWaveColor[0], positiveWaveColor[1], positiveWaveColor[2], v*2*2))  // scale [-127, 127] to [-254, 254]
            else                                                                                                     // then multiply by 2 for better intensity
                img.set(i[0], i[1], color(negativeWaveColor[0], negativeWaveColor[1], negativeWaveColor[2], -v*2*2)) // p5 clamps the values automatically
        });
        img.updatePixels();
    }
}
