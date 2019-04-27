module.exports.argmins = (array) => {
    const min = Math.min(...array);
    const minIndices = [];
    for (let i = 0; i < array.length; i++) {
        const x = array[i];
        if (x === min) {
            minIndices.push(i);
        }
    }
    return minIndices;
};

module.exports.randomInt = (min, max) => {
    /**
     *  The maximum is exclusive and the minimum is inclusive
     */
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
