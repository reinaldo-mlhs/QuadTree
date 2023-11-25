import { QuadTree, Boundary } from "../QuadTree.js";


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const boundary = new Boundary({x: 200, y: 200}, 200);
const quad = new QuadTree(boundary);


const entities = Array.from(Array(20).fill(0), () => ({id: Math.random(), point: {x: getRandomInt(0, 400), y: getRandomInt(0, 400) }}))

entities.forEach(entity => quad.insert(entity));

console.log(quad);

const ps = quad.queryRange(new Boundary({x: 50, y: 50}, 100));

console.log(ps)