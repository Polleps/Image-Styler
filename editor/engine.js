const { nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const imageDataHandler = require('./imageDataHandler.js');
const $ = document;
const trInputRangeElement = $.querySelector('#trInputRange');
const trInputNumberElement = $.querySelector('#trInputNum');
const imgElement = $.querySelector('.image');
const imgSrc = imgElement.getAttribute('src')
trInputRangeElement.addEventListener('change', applyFilter);
trInputNumberElement.addEventListener('change', applyFilter);
const rRamp = ramp(0, 255, 1);
const images = [
    "suburbs.jpeg",
];

applyFilter({target: {value: 0}});

function applyFilter(event){

    trInputRangeElement.value = event.target.value;
    trInputNumberElement.value = event.target.value;

    const ogSrc = nativeImage.createFromPath(path.join(__dirname, imgSrc));
    let bitMapData = ogSrc.toBitmap()
    
    manipulateImg(ogSrc.getBitmap, event.target.value, ogSrc.getSize());
    
    const jpg = ogSrc.toJpeg(100);
    
    fs.writeFile(path.join(__dirname, '../img/editing.jpeg'), jpg, err => {
        imgElement.setAttribute('src', '../img/editing.jpeg#' + new Date().getTime());
    });
}


function manipulateImg(data, ...args) {
    const tData = [ ...data ];
    const tr = args[0];
    const size = args[0];
    const matrix = imageDataHandler.convertToMatrix(tData, size);

    for(let x = 0; x < matrix.length; x += 2) {
        for(let y = 0; y < matrix[x].length; x += 2) {
            const avg = avarage(matrix[x][y], matrix[x][y + 1], matrix[x + 1][y], matrix[x + 1][y + 1]);
            matrix[x][y] = avg;
            matrix[x][y + 1] = avg;
            matrix[x + 1][y] = avg;
            matrix[x + 1][y + 1] = avg;
        }
    }

    data = imageDataHandler.flattenMatrix(matrix);
}

function avarage(...pixels) {
    const total = { B: 0, G: 0, R: 0, A: 255};
    pixels.forEach(pixel => {
        total.B += pixel.B;
        total.G += pixel.G;
        total.R += pixel.R;
    })
    const avg = { B: total.B / pixels.length, G: total.G / pixels.length, R: total.R / pixels.length, A: 255};
    return  avg;
}

function mapPixelPurple(B, G, R, tr) {
    gScale = Math.floor((B + R) / 2);
    B = gScale;
    G = G;
    R = gScale;
    return { B, G, R };
}

function mapPixel(B, G, R, tr) {
    gScale = Math.floor((B + G + R) / 3);
    if(R < tr) {
        // B = gScale;
        // G = gScale;
        // R = gScale;
    }
    else {
        R = rRamp.next().value;
    }
    return { B, G, R};
}

function relative(input, percentage) {
    return (input/100) * percentage;
}

function* ramp(min, max, step) {
    let count = min;
    while(true) {
        count += step;
        if(count > max) count = min;
        yield count;
    }
}



// function manipulateImg(data, ...args) {
//     const tr = Number(args[0]);
//      // Loop thru all pixels
//     for(let i = 0; i + 4 < data.length; i += 4) {
//         B = data[i];
//         G = data[i + 1];
//         R = data[i + 2];
//         isNotRed = G >= tr;

//         data[i] = (isNotRed) ? B : R;
//         data[i + 1] = (isNotRed) ? G : G;
//         data[i + 2] = (isNotRed) ? R : B;
//     }
// }