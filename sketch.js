// cnp setupu z przed labów (23.05)

// równanie fali 2D

let L = 64;
let u = Array(L); // u(t)
let img;

const SCALE = 5;

function setup()
{
    createCanvas(L * SCALE, L * SCALE);
    img = createImage(L, L);

    for (let i = 0; i < L; ++i)
    {
        u[i] = Array(L);
    }

    for (let x = 0; x < L; ++x)
        for (let y = 0; y < L; ++y)
        {
            u[x][y] = 0;
        }
}

function update()
{
}

function draw()
{
    update()

    img.loadPixels();
    for (let x = 0; x < L; ++x)
        for (let y = 0; y < L; ++y)
        img.set(x, y, 127 + u[x][y]);

    img.updatePixels();
    image(img, 0, 0, L * SCALE, L * SCALE);
}
