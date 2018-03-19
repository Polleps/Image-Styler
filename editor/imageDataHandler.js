function convertToMatrix(data, size) {
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
            matrix.push(row);
            row = [];
            pixel = 0;
        }
    }
    return matrix;
}

function flattenMatrix(matrix) {
    const flat = [];
    matrix.forEach(row => {
        row.forEach(pixel => {
            flat.push(pixel.B);
            flat.push(pixel.G);
            flat.push(pixel.R);
            flat.push(pixel.A);
        });
    });
    return flat;
}

module.exports = { convertToMatrix, flattenMatrix};
