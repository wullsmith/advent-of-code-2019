// Day 1: The Tyranny of the Rocket Equation
// 1-1
// usage: node 1-1.js [input filename]

const fs = require('fs');

// input: mass of each module
let modules = fs.readFileSync(process.argv[2], 'utf-8').split('\n').map(s => parseInt(s, 10));

let totalFuel = 0;
for (let module of modules) {
  totalFuel += Math.floor(module / 3) - 2;
}

console.log(`1-1 answer: ${totalFuel}`);
