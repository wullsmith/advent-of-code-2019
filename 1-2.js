// Day 1: The Tyranny of the Rocket Equation
// 1-2
// usage: node 1-2.js [input filename]

const fs = require('fs');

// input: mass of each module
let modules = fs.readFileSync(process.argv[2], 'utf-8').split('\n').map(s => parseInt(s, 10));

// helper to calculate fuel
function calculateFuel(mass) {
  let fuel = Math.floor(mass / 3) - 2;
  if (fuel > 0) return fuel + calculateFuel(fuel);
  return 0;
}

let totalFuel = 0;
for (let module of modules) {
  totalFuel += calculateFuel(module);
}

console.log(`1-2 answer: ${totalFuel}`);
