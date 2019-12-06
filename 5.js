// Day 5: Sunny with a Chance of Asteroids
// 5-1 and 5-2
// usage: node 5.js [program filename] [input]

const fs = require('fs');

function padZeroes(s) {
    // if string is less than 5 chars long, pad with zeroes on the left side
    let padded = s.slice();

    while (padded.length < 5) {
        padded = '0' + padded;
    }

    return padded;
}

function runIntcode(intcode, input) {
    let i = 0;
    let con = true;

    while (con) {
        let instruction = padZeroes(intcode[i].toString());
        
        // get opcode
        let opcode = parseInt(instruction.slice(-2));

        // get parameters
        let m1 = instruction.charAt(2);
        let m2 = instruction.charAt(1);
        let m3 = instruction.charAt(0); // unused

        let p1, p2, p3;

        if (m1 === '0') p1 = intcode[intcode[i+1]];
        else p1 = intcode[i+1];

        if (m2 === '0') p2 = intcode[intcode[i+2]];
        else p2 = intcode[i+2];

        p3 = intcode[i+3]; // p3 always an address

        switch (opcode) {
            case 1: // addition
                intcode[p3] = p1 + p2;
                i += 4;
                break;
            case 2: // multiplication
                intcode[p3] = p1 * p2;
                i += 4;
                break;
            case 3: // input
                intcode[intcode[i+1]] = input;
                i += 2;
                break;
            case 4: // output
                intcode[0] = p1;
                console.log(`diagnostic code: ${intcode[0]}`);
                i += 2;
                break;
            case 5: // jump-if-true
                if (p1 !== 0) i = p2;
                else i += 3;
                break;
            case 6: // jump-if-false
                if (p1 === 0) i = p2;
                else i += 3;
                break;
            case 7: // less than
                if (p1 < p2) intcode[p3] = 1;
                else intcode[p3] = 0;
                i += 4;
                break;
            case 8: // equals
                if (p1 === p2) intcode[p3] = 1;
                else intcode[p3] = 0;
                i += 4;
                break;
            case 99: // end
                con = false;
                break;
            default: 
                console.log(`Error! Invalid instruction ${instruction}`);
                con = false;
        }
    }
}

// ------------------------------------------------------------------------------------------

let intcode = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, 10));
let input = parseInt(process.argv[3], 10);

runIntcode(intcode, input);