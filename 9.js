const fs = require('fs');

// Day 9: Sensor Boost
// usage: node 9.js [program filename] [input value]

function debug(s) {
  if (DEBUG) {
    console.log(s);
  }
}

function padZeroes(s) {
  // if string is less than 5 chars long, pad with zeroes on the left side
  let padded = s.slice();
  while (padded.length < 5) {
    padded = '0' + padded;
  }
  return padded;
}

function runIntcode(program, inputs, ipStart=0) {
  let i = ipStart;
  let rb = 0; // relative base
  let con = true;
  let outputs = [];

  while (con) {
    let instruction = padZeroes(program[i].toString());
    debug(`[${i}]: ${instruction}`);
    
    // get opcode
    let opcode = parseInt(instruction.slice(-2));

    // get parameter modes
    let m1 = instruction.charAt(2);
    let m2 = instruction.charAt(1);
    let m3 = instruction.charAt(0); // unused

    // get parameters
    let p1, p2, p3;

    if (m1 === '0') p1 = program[program[i+1]];
    else if (m1 === '1') p1 = program[i+1];
    else if (m1 === '2') p1 = program[program[i+1] + rb];

    if (m2 === '0') p2 = program[program[i+2]];
    else if (m2 === '1') p2 = program[i+2];
    else if (m2 === '2') p2 = program[program[i+2] + rb];

    // """memory"""
    if (p1 === undefined) p1 = 0;
    if (p2 === undefined) p2 = 0;

    p3 = program[i+3]; // p3 always an address

    switch (opcode) {
      case 1: // addition
        debug(`\t${p1} + ${p2} => [${p3}]`);
        program[p3] = p1 + p2;
        i += 4;
        break;
      case 2: // multiplication
        debug(`\t${p1} * ${p2} => [${p3}]`);
        program[p3] = p1 * p2;
        i += 4;
        break;
      case 3: // input
        if (!inputs || inputs.length < 1) {
          debug(`No input provided; pausing execution`);
          return { 
            intcode: program, 
            ip: i,
            halted: false,
            outputs,
          };
        }
        let n = inputs.shift();
        program[p1] = n;
        debug(`\tinput: ${n} => [${p1}]`);
        i += 2;
        break;
      case 4: // output
        program[0] = p1;
        outputs.push(p1);
        debug(`\toutput ${p1}`);
        i += 2;
        break;
      case 5: // jump-if-true
        debug(`\t${p1} != 0 ? j ${p2}`);
        if (p1 !== 0) i = p2;
        else i += 3;
        break;
      case 6: // jump-if-false
        debug(`\t${p1} == 0 ? j ${p2}`);
        if (p1 === 0) i = p2;
        else i += 3;
        break;
      case 7: // less than
        debug(`\t${p1} < ${p2} ? 1 => [${p3}]`);
        if (p1 < p2) program[p3] = 1;
        else program[p3] = 0;
        i += 4;
        break;
      case 8: // equals
        debug(`\t${p1} == ${p2} ? 1 => [${p3}]`);
        if (p1 === p2) program[p3] = 1;
        else program[p3] = 0;
        i += 4;
        break;
      case 9: // relative base offset
        debug(`\trb: ${rb} + ${p1}`);
        rb += p1;
        i += 2;
        break;
      case 99: // end
        debug(`program halting`);
        return { 
            program,
            ip: i,
            rb,
            halted: true,
            outputs,
        };
      default: 
        console.log(`Error! Invalid instruction ${instruction}`);
        return { 
          program,
          ip: i,
          rb,
          halted: true,
          outputs,
        };
    }
  }
}

// ----------------------------------------------------------------------------

const intcode = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, 10));
const input = process.argv[3];

const DEBUG = true;
let res = runIntcode(intcode, [input]);
fs.writeFileSync('9.log', res.program.toString().split(',').join('\n'));