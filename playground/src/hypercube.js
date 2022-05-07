import { transpose, multiply, matrixFromColumns } from 'mathjs';
import { range , toBin } from './helpers.js';
import { bestRotation } from './linear.js';

const allPoints = range(2**4)
const bases = range(4).map(i => 2**i)
const points = matrixFromColumns(...allPoints.map(x => toBin(4, x)));

// trianglar matrix, to avoid duplicates
// test for xor giving a basis vector and
// then convert to binary vectors
const edges = []
allPoints.forEach(function(i) {
  range(i).forEach(function(j) {
    if (bases.includes(i^j)) {
      let mat = matrixFromColumns(toBin(4, i), toBin(4, j))
      edges.push(mat)
    }
  })
})

// calculate line transformations
let newLines = edges.map(function(v) {
  let l1 = transpose(multiply(bestRotation, v))
  return(l1._data.flat())
})

// calculate point transformations
let newPoints = transpose(multiply(bestRotation, points))._data

const hypercube = { points: newPoints, lines: newLines };
export { hypercube };
