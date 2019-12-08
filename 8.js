const fs = require('fs');

// Day 8: Space Image Format
// usage: node 8.js [input filename]

// find the layer with the fewest 0 digits and return it
function findLayer(image) {
    const layerLength = imageWidth * imageHeight;

    let i = 0;
    let iLayer = 0;
    let iLayerStart = 0;
    let iMin = 0;
    let zeroes = 0;
    let minZeroes = Infinity;

    while (i < image.length) {   
        if (iLayer >= layerLength) {
            // end of layer; check # of zeroes
            iLayer = 0;
            if (zeroes < minZeroes) {
                minZeroes = zeroes;
                iMin = iLayerStart;
                iLayerStart = i;
            }
            zeroes = 0;
        }
        
        
        if (image[i] === 0) zeroes++;

        i++;
        iLayer++;
    }

    return image.slice(iMin, iMin+layerLength);
}

// find the numbers of 1s and 2s in a layer and multiply them
function layerMult12(layer) {
    let ones = 0;
    let twos = 0;

    for (let n of layer) {
        if (n === 1) ones++;
        if (n === 2) twos++;
    }

    return ones * twos;
}

// stack layers and return decoded image
function decodeImage(image) {
    const layerLength = imageHeight * imageWidth;

    // initialize finalLayer as all transparent, and update it as we stack
    let finalLayer = [];
    for (let i = 0; i < layerLength; i++) {
        finalLayer.push(2);
    }

    let i = 0;
    let iLayer = 0;

    while (i < image.length) {
        if (iLayer >= layerLength) {
            iLayer = 0;
        }

        if (image[i] === 0 || image[i] === 1) {
            if (finalLayer[iLayer] === 2)
                finalLayer[iLayer] = image[i];
        }

        i++;
        iLayer++;
    }
    return finalLayer;
}

// ----------------------------------------------------------------------------

const DSN_message = fs.readFileSync(process.argv[2], 'utf-8').split('').map(s => parseInt(s, 10));
const imageWidth = 25;
const imageHeight = 6;

// 8-1
let minLayer = findLayer(DSN_message);
console.log(`8-1 answer: ${layerMult12(minLayer)}`);

// 8-2: decode image
let decodedImage = decodeImage(DSN_message);

decodedImage = decodedImage.map(c => c === 0 ? ' ' : 'X');

console.log('8-2 decoded image:');
for (let i=0; i<imageHeight; i++) {
    let lineStart = imageWidth * i;
    let lineEnd = lineStart + imageWidth;
    console.log(decodedImage.slice(lineStart, lineEnd).join(''));
}