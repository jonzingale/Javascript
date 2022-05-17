import { transpose, multiply, matrixFromColumns, matrix } from 'mathjs';
import { range , toBin } from './helpers.js';

const allPoints = range(2**4)
const bases = range(4).map(i => 2**i)
const points = matrixFromColumns(...allPoints.map(x => toBin(4, x)));
const t = Math.PI * 3 / 4

// quaternion rotation
const rotation = matrix([
  [Math.cos(t)**2,Math.cos(t)*Math.sin(t),-Math.sin(t),0],
  [-Math.cos(t)*Math.sin(t),Math.cos(t)**2,0,-Math.sin(t)]
])

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
  let l1 = transpose(multiply(rotation, v))
  return(l1._data.flat())
})

// calculate point transformations
let newPoints = transpose(multiply(rotation, points))._data

const hypercube = { points: newPoints, lines: newLines };
export { hypercube };
