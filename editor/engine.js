const { nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { flattenMatrix, convertToMatrix } = require('../editor/imageDataHandler'); 
const $ = document;
const trInputRangeElement = $.querySelector('#trInputRange');
const trInputNumberElement = $.querySelector('#trInputNum');
const imgElement = $.querySelector('.image');
const imgSrc = imgElement.getAttribute('src')
trInputRangeElement.addEventListener('change', applyFilter);
trInputNumberElement.addEventListener('change', applyFilter);
const rRamp = ramp(0, 255, 1);

applyFilter({target: {value: 2}});

function applyFilter(event){

    trInputRangeElement.value = event.target.value;
    trInputNumberElement.value = event.target.value;

    const ogSrc = nativeImage.createFromPath(path.join(__dirname, imgSrc));
    manipulateImg(ogSrc.toBitmap(), event.target.value, ogSrc.getSize()).then(manipulatedData => {
        //console.log(manipulatedData);
        const jpg = nativeImage.createFromBuffer(manipulatedData,ogSrc.getSize()).toJPEG(100);
        
        fs.writeFile(path.join(__dirname, '../img/editing.jpeg'), jpg, err => {
            imgElement.setAttribute('src', '../img/editing.jpeg#' + new Date().getTime());
        });
    });
    
}


function manipulateImg(data, ...args) {
    return new Promise((resolve, reject) => {
        console.log(typeof data);
        const tData = data.slice(0);
        const ps = Number(args[0]);
        const size = args[1];
        const tr = findNearestDivision(ps, size);
        console.log('PS / TR', ps, tr);
        convertToMatrix(tData, size).then(matrix => {
            for(let x = 0; x < matrix.length; x += tr) {
                if(matrix[x] !== undefined) {
                    for(let y = 0; y < matrix[x].length; y += tr) {
                        if(x + tr - 1 < matrix.length && y + tr - 1 < matrix[x].length){
                            let block = [];
    
                            for (let bx = 0; bx < tr; bx++) {
                                for (let by = 0; by < tr; by++) {
                                    block.push(matrix[x + bx][y + by]);
                                }
                            }
    
                            const avg = avarage(block);
    
                            for (let bx = 0; bx < tr; bx++) {
                                for (let by = 0; by < tr; by++) {
                                    matrix[x + bx][y + by] = avg;
                                }
                            }
                        }
                    }
                }
                
                
        }

        resolve(Uint8Array.from(flattenMatrix(matrix))); 
    });
    
    });

    
}

function avarage(pixels) {
    const total = { B: 0, G: 0, R: 0, A: 255};
    pixels.forEach(pixel => {
        if(pixel !== undefined){
            total.B += pixel.B;
            total.G += pixel.G;
            total.R += pixel.R;
        }
        else {
            total.B += 255;
            total.G += 255;
            total.R += 255;
        }
        
    })
    const avg = { B: total.B / pixels.length, G: total.G / pixels.length, R: total.R / pixels.length, A: 255};
    return  avg;
}

function findNearestDivision(n, size) {
    let i = (n >= 1) ? n : 2;
    for (i; i >= 1; i = i - 1) {
        if(size.width % i == 0 && size.height -1 % i == 0) return i;
    }
    return i
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