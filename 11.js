const fs = require('fs');
const { runIntcode } = require('./intcode');

// Day 11: Space Police
// usage: node 11.js [input filename] [-d]

function debug(s) {
  if (DEBUG) {
    console.log(s);
  }
}

class Robot {
  constructor(intcode) {
    this.program = [...intcode];
    this.ip = 0;
    this.rb = 0;

    this.direction = 0; // 0,1,2,3 = U,L,D,R
    this.x = 0;
    this.y = 0;
    this.paintedTiles = {};
  }

  turnLeft() {
    debug('turning left...');
    this.direction = (this.direction + 1) % 4;
  }

  turnRight() {
    debug('turning right...');
    this.direction = this.direction - 1;
    if (this.direction < 0) this.direction = 3;
  }

  moveForward() {
    switch (this.direction) {
      case 0: // up
        this.y++;
        break;
      case 1: // left
        this.x--;
        break;
      case 2: // down
        this.y--;
        break;
      case 3: // right
        this.x++;
        break;
    }
  }

  paint(color) {
    debug(`painting ${this.x},${this.y} ${color ? 'white' : 'black'}`);
    this.paintedTiles[`${this.x},${this.y}`] = color;
  }

  run() {
    debug('Starting robot program...')
    let con = true;
    let input = 0;

    while(con) {
      debug(`robot position: ${this.x},${this.y}`);
      if (this.paintedTiles[`${this.x},${this.y}`] === 1) input = 1;
      else input = 0;

      let { program, ip, rb, outputs, halted } = runIntcode(this.program, [input], this.ip, this.rb);

      // painting complete
      if (halted) {
        return this.paintedTiles;
      }

      if (!outputs || outputs.length !== 2) {
        debug(`Error! Insufficient outputs provided: ${outputs}`)
        return;
      }

      let color = outputs[0];
      let dir = outputs[1];

      this.paint(color);
      if (dir === 0) this.turnLeft();
      else if (dir === 1) this.turnRight();
      else {
        debug(`Invalid direction output: ${dir}`);
        return;
      }

      this.moveForward();

      this.program = program;
      this.ip = ip;
      this.rb = rb;
    }
  }
}

// ----------------------------------------------------------------------------

const intcode = fs.readFileSync(process.argv[2], 'utf-8').split(',').map(s => parseInt(s, 10));
const DEBUG = process.argv.includes('-d');
let robot = new Robot(intcode);
let paintedTiles = robot.run();
console.log(`number of tiles painted: ${Object.keys(paintedTiles).length}`);