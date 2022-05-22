import { transpose, multiply, matrixFromColumns, matrix } from 'mathjs';
import { range , toBin } from './helpers.js';

let HyperCube = class {
  constructor() {
    this.nodes = this.getPoints()
    this.edges = this.getEdges()
  }

  rotation() {
    const t = Math.PI * 3 / 4

    // quaternion rotation
    const rotation = matrix([
      [Math.cos(t)**2,Math.cos(t)*Math.sin(t),-Math.sin(t),0],
      [-Math.cos(t)*Math.sin(t),Math.cos(t)**2,0,-Math.sin(t)]
    ])

    return(rotation)
  }

  getPoints() {
    const rotation = this.rotation()
    const points = matrixFromColumns(...range(2**4).map(x => toBin(4, x)));
    let newPoints = transpose(multiply(rotation, points))._data

    return newPoints 
  }

  getEdges() {
    // trianglar matrix, to avoid duplicates
    // test for xor giving a basis vector and
    // then convert to binary vectors
    const edges = []
    const rotation = this.rotation()
    const bases = range(4).map(i => 2**i)
    range(2**4).forEach(function(i) {
      range(i).forEach(function(j) {
        if (bases.includes(i^j)) {
          let mat = matrixFromColumns(toBin(4, i), toBin(4, j))
          edges.push(mat)
        }
      })
    })

    // calculate line transformations
    let newEdges = edges.map(function(v) {
      let l1 = transpose(multiply(rotation, v))
      return(l1._data.flat())
    })

    return newEdges
  }
}

export { HyperCube };
