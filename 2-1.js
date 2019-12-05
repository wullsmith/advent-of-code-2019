// Day 2: 1202 Program Alarm
// 2-1
// usage: node 2-1.js [input filename]

const fs = require('fs');

let intcode = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, '10'));

// restore 1202 alarm state
intcode[1] = 12;
intcode[2] = 2;

let con = true;
let i = 0;

while (con) {
  let op = intcode[i];
  let p1 = intcode[i+1];
  let p2 = intcode[i+2];
  let p3 = intcode[i+3];

  switch (op) {
    case 1: // addition
      intcode[p3] = intcode[p1] + intcode[p2];
      i += 4;
      break;
    case 2: // multiplication
      intcode[p3] = intcode[p1] * intcode[p2];
      i += 4;
      break;
    case 99: // end
      con = false;
      break;
  }
}

// output position 0
console.log(`2-1 answer: ${intcode[0]}`);