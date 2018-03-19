module.exports = function(filterName) {
    const filters = {
        
    }
    if(filters[filterName]) {
        return filters[filterName];
    }
    throw new Exception();
}