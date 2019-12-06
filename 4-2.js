// Day 4: Secure Container
// 4-2
// input: 108457-562041
// usage: node 4-2.js [input]

const fs = require('fs');

const inputs = process.argv[2].split('-');
const min = parseInt(inputs[0], 10);
const max = parseInt(inputs[1], 10);

// return true if password meets requirements
function checkPassword(password) {
    // check length
    if (password.length !== 6) return false;

    let valid = false;
    let pwArray = password.split('');

    // check for adjacent digits and strictly increasing digits
    let consecutive = 1;
    for (let i = 0; i < 6; i++) {
        if (i > 0) {
            if (pwArray[i] === pwArray[i-1]) {
                consecutive++;
                if (i === 5 && consecutive === 2) valid = true;
            } else {
                if (consecutive === 2) valid = true;
                else consecutive = 1;
            }
        }
        if (pwArray[i] > pwArray[i+1]) return false;
    }

    return valid;
}

// check all passwords in range
let validPasswords = 0;
for (let pw = min; pw <= max; pw++) {
    if (checkPassword(pw.toString())) validPasswords++;
}

console.log(`4-2 answer: ${validPasswords}`);