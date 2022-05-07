import { transpose, multiply, matrix } from 'mathjs';
import { range , toBin } from './helpers.js';
import { bestRotation } from './linear.js';

const allPoints = range(2**4)
const bases = range(4).map(i => 2**i)
const points = matrix(allPoints.map(x => toBin(4, x)));

// trianglar matrix, to avoid duplicates
// test for xor giving a basis vector and
// then convert to binary vectors
const edges = []
allPoints.forEach(function(i) {
  range(i).forEach(function(j) {
    if (bases.includes(i^j)) {
      let es = [toBin(4, i), toBin(4, j)]
      edges.push(matrix(es))
    }
  })
})

// calculate line transformations
let newLines = []
edges.forEach(function(vs) {
  let l1 = transpose(multiply(bestRotation, transpose(vs)))
  newLines.push(l1._data.flat())
})

// calculate point transformations
let newPoints = transpose(multiply(bestRotation, transpose(points)))._data

const hypercube = { points: newPoints, lines: newLines };
export { hypercube };
