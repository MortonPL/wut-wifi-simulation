/* Room represents a discrete 2D space as four matrices containing:
** value at point
** previous value at point
** next value at point
** refraction coefficient
*/
class Room
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.values = math.matrix(math.zeros(this.width, this.height));
        this.lastValues = math.matrix(math.zeros(this.width, this.height));
        this.nextValues = math.matrix(math.zeros(this.width, this.height));
        this.materials = math.matrix(math.zeros(this.width, this.height));
    }

    getValue(x, y)              { return this.values.valueOf()[x][y];       }
    setValue(x, y, v)           { this.values.valueOf()[x][y] = v;          }
    getLastValue(x, y)          { return this.lastValues.valueOf()[x][y];   }
    setLastValue(x, y, v)       { this.lastValues.valueOf()[x][y] = v;      }
    getNextValue(x, y)          { return this.nextValues.valueOf()[x][y];   }
    setNextValue(x, y, v)       { this.nextValues.valueOf()[x][y] = v;      }
    getMaterialValue(x, y)      { return this.materials.valueOf()[x][y];    }
    setMaterialValue(x, y, v)   { this.materials.valueOf()[x][y] = v;       }
    setMaterial(v) { this.materials.forEach( function(_, i, m){ m[i[0]][i[1]] = v} ) }

    // draw self
    draw(img)
    {
        img.loadPixels();
        this.values.forEach( function (v, i, _)
        {
            img.set(i[0], i[1], 127 + v);
        });
        img.updatePixels();
    }
}
