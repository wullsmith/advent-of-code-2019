const fs = require('fs');
const lcm = require('compute-lcm');

// Day 12: The N-body Problem
// usage: node 12.js [input filename] [-debug]

let DEBUG = false;

function debug(s) {
  if (DEBUG) console.log(s);
}

// Moon object
class Moon {
  constructor(id, px, py, pz) {
    this.id = id;

    this.px = parseInt(px);
    this.py = parseInt(py);
    this.pz = parseInt(pz);

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    debug(`created moon ${this.id} @ (${this.px},${this.py},${this.pz})`)
  }

  positionString(short) {
    if (short) return `${this.px}${this.py}${this.pz}`;
    return `(${this.px},${this.py},${this.pz})`;
  }

  velocityString(short) {
    if (short) return `${this.vx}${this.vy}${this.vz}`
    return `(${this.vx},${this.vy},${this.vz})`;
  }

  potentialEnergy() {
    let pe = Math.abs(this.px) + Math.abs(this.py) + Math.abs(this.pz);
    debug(`moon ${this.id} PE: ${pe}`);
    return pe;
  }

  kineticEnergy() {
    let ke = Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.vz);
    debug(`moon ${this.id} KE: ${ke}`);
    return ke;
  }

  move() {
    this.px += this.vx;
    this.py += this.vy;
    this.pz += this.vz;
    debug(`moon ${this.id} moved to (${this.px},${this.py},${this.pz})`);
  }

  applyGravity(moons) {
    // add or subtract 1 from each velocity axis
    for (let moon of moons) {
      if (moon.id === this.id) continue;

      debug(`comparing positions: ${this.positionString()} --- ${moon.positionString()}`);

      if (moon.px > this.px) this.vx += 1;
      else if (moon.px < this.px) this.vx -= 1;
      if (moon.py > this.py) this.vy += 1;
      else if (moon.py < this.py) this.vy -= 1;
      if (moon.pz > this.pz) this.vz += 1;
      else if (moon.pz < this.pz) this.vz -= 1;
    }

    debug(`moon ${this.id} velocity: (${this.vx},${this.vy},${this.vz})`);
  }
}

// apply gravity more efficiently
function applyGravityAll(moons) {
  for (let i = 0; i < moons.length-1; i++) {
    for (let j = i+1; j < moons.length; j++) {
      let moonA = moons[i];
      let moonB = moons[j];

      if (moonA.px < moonB.px) {
        moonA.vx++;
        moonB.vx--;
      } else if (moonA.px > moonB.px) {
        moonA.vx--;
        moonB.vx++;
      }

      if (moonA.py < moonB.py) {
        moonA.vy++;
        moonB.vy--;
      } else if (moonA.py > moonB.py) {
        moonA.vy--;
        moonB.vy++;
      }

      if (moonA.pz < moonB.pz) {
        moonA.vz++;
        moonB.vz--;
      } else if (moonA.pz > moonB.pz) {
        moonA.vz--;
        moonB.vz++;
      }
    }
  }
}

function totalEnergy(moons) {
  let energy = 0;
  for (let moon of moons) {
    energy += moon.potentialEnergy() * moon.kineticEnergy();
  }

  return energy;
}

function getState(moons, short) {
  let state = '';
  for (let moon of moons) {
    state += moon.positionString(short) + moon.velocityString(short);
  }

  debug(`state of the universe: ${state}`);
  return state;
}

function getStateX(moons) {
  let state = '';
  for (let moon of moons) {
    state += moon.px + moon.vx;
  }

  return state;
}

function getStateY(moons) {
  let state = '';
  for (let moon of moons) {
    state += moon.py + moon.vy;
  }

  return state;
}

function getStateZ(moons) {
  let state = '';
  for (let moon of moons) {
    state += moon.pz + moon.vz;
  }

  return state;
}

function parseInput(input) {
    let moons = [];
    const regex = /(\-?\d+)/g;
    let i = 1;
    for (let line of input) {
      let [x, y, z] = line.match(regex);
      moons.push(new Moon(i, x, y, z));
      i++;
    }
    return moons;
}

// ----------------------------------------------------------------------------
// read input
const input = fs.readFileSync(process.argv[2], 'utf-8').split('\n');
DEBUG = process.argv.includes('-debug');

let moons = parseInput(input);

// 12-1
// process 1000 time steps
const stepLimit = 1000;
for (let step = 0; step < stepLimit; step++) {
  for (let moon of moons) {
    moon.applyGravity(moons);
  }
  for (let moon of moons) {
    moon.move();
  }
}

console.log(`12-1: total energy after ${stepLimit} steps: ${totalEnergy(moons)}`);
console.log(`------------------------------------------------------------------`);

// 12-2
// how many steps before a previous state is reached?
moons = parseInput(input);
let statesX = {};
let statesY = {};
let statesZ = {};

let startX = getStateX(moons);
let startY = getStateY(moons);
let startZ = getStateZ(moons);

let periodX = 0;
let periodY = 0;
let periodZ = 0;

let stepsTaken = 0;
while (true) {
  applyGravityAll(moons);
  for (let moon of moons) moon.move();
  stepsTaken++;
  
  let stateX = getStateX(moons);
  let stateY = getStateY(moons);
  let stateZ = getStateZ(moons);
  
  if (stateX === startX && !periodX) {
    console.log(`x period found: ${stepsTaken}`);
    periodX = stepsTaken;
  }
  
  if (stateY === startY && !periodY) {
    console.log(`y period found: ${stepsTaken}`);
    periodY = stepsTaken;
  }
  
  if (stateZ === startZ && !periodZ) {
    console.log(`z period found: ${stepsTaken}`);
    periodZ = stepsTaken;
  }

  
  statesX[stateX] = 1;
  statesY[stateY] = 1;
  statesZ[stateZ] = 1;
  
  if (periodX && periodY && periodZ) {
    console.log(`12-2: steps to repeat a state: ${lcm(periodX, periodY, periodZ)}`);
    break;
  }
}
