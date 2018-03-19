function convertToMatrix(data, size) {
    //console.log(data);
    return new Promise((resolve, reject) => {
        //console.log(size);
        const matrix = [];
        let row = [];
        let pixel = 0;
        for(let i = 0; i < data.length; i += 4) {
            row.push(
                {
                    B: data[i],
                    G: data[i + 1],
                    R: data[i + 2],
                    A: data[i + 3],
                }
            );
            pixel++;
            if(pixel >= size.width) {
                // matrix.push(row.map( (p) => {
                //     Object.assign({}, p);
                // }));
                matrix.push(row);
                row = [];
                pixel = 0;
            }
        }
        //console.log('Matrix', matrix);
        resolve(matrix);
    });
    
}

function flattenMatrix(matrix) {
    
    const flat = [];
    for (let row of matrix) {
        for (let pixel of row) {
            flat.push(pixel.B);
            flat.push(pixel.G);
            flat.push(pixel.R);
            flat.push(pixel.A);
        }
    }
    //console.log('In Flatten')
    return flat;
}

module.exports = { flattenMatrix, convertToMatrix};