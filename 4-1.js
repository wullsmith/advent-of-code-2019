// Day 4: Secure Container
// 4-1
// input: 108457-562041
// usage: node 4-1.js [input]

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
    for (let i = 0; i < 5; i++) {
        if (pwArray[i] === pwArray[i+1]) valid = true;
        if (pwArray[i] > pwArray[i+1]) return false;
    }

    return valid;
}

// check all passwords in range
let validPasswords = 0;
for (let pw = min; pw <= max; pw++) {
    if (checkPassword(pw.toString())) validPasswords++;
}

console.log(`4-1 answer: ${validPasswords}`);