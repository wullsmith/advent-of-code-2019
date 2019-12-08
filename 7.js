const fs = require('fs');

// Day 7: Amplification Circuit

// find and return list of all permutations of input list
function permutations(list) {
    if (!list.length || list.length === 1) return [list];

    let perms = [];
    for (let i = 0; i < list.length; i++) {
        let n = list[i];
        let rem = [...list];
        rem.splice(i, 1);
        
        for (let p of permutations(rem)) {
            perms.push([n].concat(p));
        }
    }

    return perms;
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
    let con = true;
    let outputs = [];

    while (con) {
        let instruction = padZeroes(program[i].toString());
        
        // get opcode
        let opcode = parseInt(instruction.slice(-2));

        // get parameters
        let m1 = instruction.charAt(2);
        let m2 = instruction.charAt(1);
        let m3 = instruction.charAt(0); // unused

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

// ----------------------------------------------------------------------------

const intcode = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, 10));
const ampNames = ['A', 'B', 'C', 'D', 'E'];

// run all 5 amplifiers
let maxOutput = 0;

// generate every permutation of phase settings
let phaseSettingPerms = permutations([0,1,2,3,4]);

for (let phaseSettings of phaseSettingPerms) {
    let output = 0;
    for (let i = 0; i < 5; i++) {
        result = runIntcode([...intcode], [phaseSettings[i], output], 0);
        output = result.program[0];
    }
    if (output > maxOutput) maxOutput = output;
}

console.log(`Max amplifier output: ${maxOutput}`); // 7-1 answer

// ----------------------------------------------------------------------------
// 7-2: feedback mode
let feedbackPerms = permutations([5,6,7,8,9]);

maxOutput = 0;

for (let phaseSettings of feedbackPerms) {
    // initialize memory to store all programs, pending inputs, and instruction pointers
    let mem = {};
    for (let i = 0; i < 5; i++) {
        mem[ampNames[i]] = {
            program: [...intcode],
            inputs: [phaseSettings[i]],
            ip: 0
        }
    }

    mem['A'].inputs.push(0);

    // run program and keep track of highest output value
    let i = 0;
    let con = true;
    let finalOutput = 0;

    while (con) {
        let name = ampNames[i];
        let buffer = mem[name];
        let result = runIntcode(buffer.program, buffer.inputs, buffer.ip);
        buffer.ip = result.ip;

        // end?
        if (result.halted && name === 'E') {
            finalOutput = result.program[0];
            break;
        }

        i = (i + 1) % ampNames.length;

        // add output to next amp's inputs
        for (let output of result.outputs) mem[ampNames[i]].inputs.push(output);
    }
    if (finalOutput > maxOutput) maxOutput = finalOutput;
}

console.log(`Max output in feedback mode: ${maxOutput}`);

