// Day 3: Crossed Wires
// 3-2
// usage: node 3-2.js [input filename]

const fs = require('fs');

const input = fs.readFileSync(process.argv[2], 'utf-8').split('\n');
const wireA = input[0].split(',');
const wireB = input[1].split(',');

// follow path of wire, setting each position to number of steps
// if no path given to compare, return object containing all positions of path
// if compare path given, return object containing only intersections
function createPathObject(wirePath, comparePositions) {
  let pX = 0;
  let pY = 0;
  let newPositions = {};
  let steps = 0;

  for (let s of wirePath) {
    let dir = s.charAt(0);
    let distance = parseInt(s.substring(1), 10);
    let vX = 0;
    let vY = 0;

    switch (dir) {
      case 'R':
        vX = 1;
        break;
      case 'D':
        vY = -1;
        break;
      case 'L':
        vX = -1;
        break;
      case 'U':
        vY = 1;
        break;
    }

    for (let i = 0; i < distance; i++) {
      pX += vX;
      pY += vY;
      let k = `${pX},${pY}`;

      steps++;

      // if we are comparing, we only care about intersections
      if (!comparePositions) newPositions[k] = steps;
      else if (comparePositions[k]) newPositions[k] = comparePositions[k] + steps;
    }
  }
  return newPositions;
}

// ----------------------------------------------

let positionsA = createPathObject(wireA);
let intersections = createPathObject(wireB, positionsA);

let minSteps = 10000000;

for (let k in intersections) {
  let steps = intersections[k];
  if (steps < minSteps) minSteps = steps;
}

console.log(`3-2 answer: ${minSteps}`);