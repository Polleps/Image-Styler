module.exports = function(filterName) {
    const filters = {
        
    }
    if(filters[filterName]) {
        return filters[filterName];
    }
    throw new Exception();
}


const avg = avarage([matrix[x][y], matrix[x][y + 1], matrix[x + 1][y], matrix[x + 1][y + 1]]);
                        matrix[x][y] = avg;
                        matrix[x][y + 1] = avg;
                        matrix[x + 1][y] = avg;
                        matrix[x + 1][y + 1] = avg;