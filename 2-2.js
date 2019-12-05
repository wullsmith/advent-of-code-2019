// Day 2: 1202 Program Alarm
// 2-2
// usage: node 2-2.js [input filename] [target output]
// target output is 19690720

const fs = require('fs');

const intcodeOrig = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, '10'));
const targetOutput = parseInt(process.argv[3], 10);

function main() {
  // check values 1-99 for noun and verb
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      // initialize and set input values
      let intcode = [...intcodeOrig];
      intcode[1] = noun;
      intcode[2] = verb;

      let con = true;
      let i = 0;

      // run program
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

        // check for target output
        if (intcode[0] === targetOutput) {
          console.log(`target output found with noun ${noun} and verb ${verb}`);
          console.log(`2-2 answer: ${100 * noun + verb}`);
          return;
        }
      }
    }
  }
  console.log(`failure: target output ${targetOutput} not found`);
}

main();