function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) { //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function shuffleArray(arr) {
    // let shuffledArr = []
    // for (let i = 0; i < arr.length; i++) {
    //     let randomIdx = arr.splice(getRandomInt(0, arr.length), 1)
    //     shuffledArr.push(...randomIdx)
    // }
    // return shuffledArr
    return arr.sort( () => .5 - Math.random() )
}