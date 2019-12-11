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

    // get parameters (addresses of operands)
    let p1, p2, p3;

    if (m1 === '0') p1 = program[i+1];
    else if (m1 === '1') p1 = i+1;
    else if (m1 === '2') p1 = program[i+1] + rb;

    if (m2 === '0') p2 = program[i+2];
    else if (m2 === '1') p2 = i+2;
    else if (m2 === '2') p2 = program[i+2] + rb;

    if (m3 === '0') p3 = program[i+3];
    else if (m3 === '1') {
      debug('Error: output address set to immediate mode');
      return;
    }
    else if (m3 === '2') p3 = program[i+3] + rb;

    // "memory"
    if (program[p1] === undefined) program[p1] = 0;
    if (program[p2] === undefined) program[p2] = 0;

    // run instruction
    switch (opcode) {
      case 1: // addition
        debug(`\t${program[p1]} + ${program[p2]} => [${p3}]`);
        program[p3] = program[p1] + program[p2];
        i += 4;
        break;
      case 2: // multiplication
        debug(`\t${program[p1]} * ${program[p2]} => [${p3}]`);
        program[p3] = program[p1] * program[p2];
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
        let n = parseInt(inputs.shift(), 10);
        program[p1] = n;
        debug(`\tinput: ${n} => [${p1}]`);
        i += 2;
        break;
      case 4: // output
        program[0] = program[p1];
        outputs.push(program[p1]);
        debug(`\toutput ${program[p1]}`);
        i += 2;
        break;
      case 5: // jump-if-true
        debug(`\t[${p1}]${program[p1]} != 0 ? j ${program[p2]}`);
        if (program[p1] !== 0) i = program[p2];
        else i += 3;
        break;
      case 6: // jump-if-false
        debug(`\t[${p1}]${program[p1]} == 0 ? j ${program[p2]}`);
        if (program[p1] === 0) i = program[p2];
        else i += 3;
        break;
      case 7: // less than
        debug(`\t[${p1}]${program[p1]} < [${p2}]${program[p2]} ? 1 => [${p3}]`);
        if (program[p1] < program[p2]) program[p3] = 1;
        else program[p3] = 0;
        i += 4;
        break;
      case 8: // equals
        debug(`\t[${p1}]${program[p1]} == [${p2}]${program[p2]} ? 1 => [${p3}]`);
        if (program[p1] === program[p2]) program[p3] = 1;
        else program[p3] = 0;
        i += 4;
        break;
      case 9: // relative base offset
        debug(`\trb: ${rb} + ${program[p1]}`);
        rb += program[p1];
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

const DEBUG = false;
const intcode = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, 10));
const input = parseInt(process.argv[3], 10);

let res = runIntcode(intcode, [input]);
fs.writeFileSync('9.log', res.program.toString().split(',').join('\n'));