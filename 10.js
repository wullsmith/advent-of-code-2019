const fs = require('fs');

// Day 10: Monitoring Station
// usage: node 10.js [input filename] [-debug]

function debug(s) {
    if (DEBUG) console.log(s);
}

// create object containing coordinates of all asteroids
function createAsteroidMap(input) {
    debug(`creating asteroid map...`)
    let rows = input.split('\n');
    let map = {};

    for (let y = 0; y < rows.length; y++) {
        let row = rows[y].split('');
        for (let x = 0; x < row.length; x++) {
            if (row[x] === '#') {
                map[`${x},${y}`] = 1;
            }
        }
    }

    debug(`mapped ${Object.keys(map).length} asteroids`);
    return map;
}

// bad, shame on you
function countVisibleBad(x0, y0, map) {
    debug(`finding asteroids visible from (${x0},${y0})`)
    let nVisibleAsteroids = 0;

    for (let k in map) {
        let blocked = false;
        let coord = k.split(',');
        let xC = parseInt(coord[0]);
        let yC = parseInt(coord[1]);

        if (xC === x0 && yC === y0) continue;

        // get slope
        let slope = (yC - y0) / (xC - x0);
        debug(`slope between (${x0},${y0}) and (${xC},${yC}): ${slope}`);

        // check for obstructing asteroids
        let x = x0;
        let y = y0;

        if (slope === Infinity || slope === -Infinity) {
            let step = y0 < yC ? 1 : -1;
            y += step;

            while (y != yC) {
                if (map[`${x},${y}`]) {
                    debug(`(${x0},${y0}) => (${xC},${yC}) blocked by (${x},${y})`);
                    blocked = true;
                    break;
                }
                y += step;
            }
        }

        else {
            let step = x0 < xC ? 1 : -1;
            x += step;
            y += step * slope;

            while (x != xC) {
                
                if (y === Math.floor(y)) {
                    if (map[`${x},${y}`]) {
                        debug(`(${x0},${y0}) => (${xC},${yC}) blocked by (${x},${y})`);
                        blocked = true;
                        break;
                    }
                }
                x += step;
                y += step * slope;
            }
        }

        if (!blocked) {
            debug(`(${x0},${y0}) => (${xC},${yC}) clear`);
            nVisibleAsteroids++;
        }
    }
    return nVisibleAsteroids;
}

// count number of asteroids visible from given coordinates
function countVisible(x0, y0, map) {
    debug(`finding asteroids visible from (${x0},${y0})`)
    let nVisibleAsteroids = 0;
    let slopes = {};

    for (let k in map) {
        let coord = k.split(',');
        let xC = parseInt(coord[0]);
        let yC = parseInt(coord[1]);

        if (xC === x0 && yC === y0) continue;

        // get slope
        let slope = (yC - y0) / (xC - x0);

        let xDir = 0;
        if (x0 - xC > 0) xDir = 1;
        else if (x0 - xC < 0) xDir = -1;

        if (slopes[slope] == xDir) {
            continue;
        } else {
            slopes[slope] = xDir;
            nVisibleAsteroids++;
        }
    }
    return nVisibleAsteroids;
}

// find asteroid with most viewable asteroids
function findBestAsteroid(map) {
    debug(`finding best asteroid...`)
    let mostVisible = 0;
    let bestCoords = [-999, -999];

    for (let k in map) {
        let coord = k.split(',');
        let x = parseInt(coord[0], 10);
        let y = parseInt(coord[1], 10);

        debug(`counting for (${x},${y})`);
        let nVisible = countVisible(x, y, map);
        if (nVisible > mostVisible) {
            bestCoords = [x, y];
            mostVisible = nVisible;
        }
    }
    return {
        x: bestCoords[0],
        y: bestCoords[1],
        count: mostVisible,
    };
}

// destroy asteroids and return the nth one destroyed
function destroyAsteroids(x0, y0, map, n) {

}

// ----------------------------------------------------------------------------

const rawInput = fs.readFileSync(process.argv[2], 'utf-8');
const DEBUG = process.argv.includes('-debug');
const map = createAsteroidMap(rawInput);
const res1 = findBestAsteroid(map);

// 10-1
console.log(`best asteroid is at (${res1.x}, ${res1.y}). It can view ${res1.count} other asteroids.`);

// 10-2
// const res2 = destroyAsteroids(res1.x, res1.y, map, 200);
// console.log(`the 200th asteroid destroyed was at (${res2.x},${res2.y})`);
// console.log(`10-2 answer: ${res2.x * 100 + res2.y}`);

// failures
// 1309 (13,9) high