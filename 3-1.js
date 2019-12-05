// Day 3: Crossed Wires
// 3-1
// usage: node 3-1.js [input filename]

const fs = require('fs');

const input = fs.readFileSync(process.argv[2], 'utf-8').split('\n');
const wireA = input[0].split(',');
const wireB = input[1].split(',');

// follow path of wire, setting each position to 1
// if no path given to compare, return object containing all positions of path
// if compare path given, return object containing only intersections
function createPathObject(wirePath, comparePositions) {
  let pX = 0;
  let pY = 0;
  let newPositions = {};

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

      // if not comparing paths, add position
      // if comparing paths, add position only if it intersects
      if (!comparePositions || comparePositions[k]) newPositions[k] = 1;
    }
  }
  return newPositions;
}

// ----------------------------------------------

let positionsA = createPathObject(wireA);
let intersections = createPathObject(wireB, positionsA);

console.log(positionsA);

let minDistance = 10000000;

for (let k in intersections) {
  console.log(k);
  let pos = k.split(',');
  let x = pos[0];
  let y = pos[1];
  let dist = Math.abs(x) + Math.abs(y);

  if (dist < minDistance) {
    minDistance = dist;
  }
}

console.log(`3-1 answer: ${minDistance}`);