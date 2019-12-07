// Day 6: Universal Orbit Map
// usage: node 6.js [input filename]

const fs = require('fs');

// create orbit map which maps small->big
function createOrbitMap(list) {
  let orbitMap = {};
  for (let pair of orbitList) {
    let arr = pair.split(')');
    let big = arr[0];
    let small = arr[1];
    orbitMap[small] = big;
  }

  return orbitMap;
}

// count direct + indirect orbits
function countOrbits(orbitMap) {
  let nOrbits = 0;

  // follow each orbit chain down to COM
  for (let k in orbitMap) {
    let orbitedBody = orbitMap[k];
    while (orbitedBody) {
      nOrbits++;
      orbitedBody = orbitMap[orbitedBody];
    }
  }

  return nOrbits;
}

// calculate # of orbital transfers required to get from A to B
function minimumTransfers(orbitMap, A, B) {
  // follow orbit chain from A to COM
  let nTransfers = 0;
  let transfersA = {};
  let transfersB = {};

  let orbitedBody = orbitMap[A];

  while (orbitedBody) {
    transfersA[orbitedBody] = nTransfers++;
    orbitedBody = orbitMap[orbitedBody];
  }

  // follow orbit chain from B to COM, stopping when we've reached a common orbited body
  nTransfers = 0;
  orbitedBody = orbitMap[B];

  while (orbitedBody) {
    transfersB[orbitedBody] = nTransfers++;
    if (transfersA[orbitedBody]) {
      return transfersA[orbitedBody] + transfersB[orbitedBody];
    }
    orbitedBody = orbitMap[orbitedBody];
  }

  console.log(`Error: no path found between ${A} and ${B}`);
  return -1;
}

// ----------------------------------------------------------------------------

const orbitList = fs.readFileSync(process.argv[2], 'utf-8').split('\n');
const orbitMap = createOrbitMap(orbitList);
const nOrbits = countOrbits(orbitMap);
const transfers = minimumTransfers(orbitMap, 'YOU', 'SAN');

console.log(`total orbits in map: ${nOrbits}`);
console.log(`minimum transfers between YOU and SAN: ${transfers}`);