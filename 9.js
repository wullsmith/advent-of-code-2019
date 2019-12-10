// Day 9: Sensor Boost


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
  let con = true;
  let outputs = [];

  while (con) {
    let instruction = padZeroes(program[i].toString());
    
    // get opcode
    let opcode = parseInt(instruction.slice(-2));

    // get parameter modes
    let m1 = instruction.charAt(2);
    let m2 = instruction.charAt(1);
    let m3 = instruction.charAt(0); // unused

    // get parameters
    let p1, p2, p3;

    if (m1 === '0') p1 = program[program[i+1]];
    else p1 = program[i+1];

    if (m2 === '0') p2 = program[program[i+2]];
    else p2 = program[i+2];

    p3 = program[i+3]; // p3 always an address

    switch (opcode) {
      case 1: // addition
        program[p3] = p1 + p2;
        i += 4;
        break;
      case 2: // multiplication
        program[p3] = p1 * p2;
        i += 4;
        break;
      case 3: // input
        if (!inputs || inputs.length < 1) {
          // console.log(`No input provided; pausing execution`);
          return { 
            intcode: program, 
            ip: i, 
            halted: false,
            outputs,
          };
        }
        let n = inputs.shift();
        program[program[i+1]] = n;
        i += 2;
        break;
      case 4: // output
        program[0] = p1;
        outputs.push(p1);
        i += 2;
        break;
      case 5: // jump-if-true
        if (p1 !== 0) i = p2;
        else i += 3;
        break;
      case 6: // jump-if-false
        if (p1 === 0) i = p2;
        else i += 3;
        break;
      case 7: // less than
        if (p1 < p2) program[p3] = 1;
        else program[p3] = 0;
        i += 4;
        break;
      case 8: // equals
        if (p1 === p2) program[p3] = 1;
        else program[p3] = 0;
        i += 4;
        break;
      case 99: // end
        // console.log(`program halting`);
        return { 
            program: program, 
            ip: i, 
            halted: true,
            outputs, 
        };
        break;
      default: 
        console.log(`Error! Invalid instruction ${instruction}`);
        console.log({ 
            //intcode: program, 
            ip: i, 
            halted: true,
            outputs,
        });
        con = false;
      }
  }
}