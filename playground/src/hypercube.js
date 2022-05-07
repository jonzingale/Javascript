import * as math from 'mathjs';
import { floor, cos, sin, PI} from 'mathjs';
import { range, zeros, rootsUnity, rot, rot_simp, toBinary } from './helpers.js';
import { width, height } from './constants.js';
import { m1, m2, ls, i4 } from './linear.js';

const bases = range(4).map(i => 2**i)
const allPoints = range(2**4)

// trianglar matrix, so no duplications
// bit operate for xor
const edges = []
allPoints.forEach(function(x, i) {
  range(x).forEach(function(j) {
    if (bases.includes(i^j)) { edges.push([i, j]) }
  })
})

// from bitwise operation to binary vectors
const coords = []
edges.forEach(function([a ,b]) {
    let n = (a >>> 0).toString(2)
      .padStart(4, '0').split('')
    let m = (b >>> 0).toString(2)
      .padStart(4, '0').split('')
    coords.push(math.matrix([n,m]))
})

//TODO: TAKE COORDS ABOVE AND:
// 1. perform transforms
// 2. append lines

const points = function(n) {
  let ps = []
  let bins = range(2**n).map(function(x) {
    let pt = (x >>> 0).toString(2)
      .padStart(4, '0').split('')
    return(pt);
  });
  return(bins);
};

// console.log(points(4))

// towards linear transformation of vectors
let hc = math.transpose(math.matrix(points(4)))
let ps = math.multiply(rot, hc)
let rows = math.transpose(ps)

// rows._data.forEach(x => console.log(x))

const cube = d3.select("svg").selectAll("pts")
  .data(rows._data).enter().append("circle")

cube.attr("cx", function(d) { return (100 * d[0] + width/2)  });
cube.attr("cy", function(d) { return (100 * d[1] + height/2) });
cube.attr("r", 3);

let newCoords = []
coords.forEach(function(vs) {
  let v = math.transpose(vs)
  let rs = math.multiply(rot, v)
  let l1 = math.transpose(rs)
  newCoords.push(l1._data.flat())
})

const lines = d3.select("svg").append("g").selectAll("line")
  .data(newCoords).enter().append("line").attr("stroke", "black")
  .attr("x1", function(d) { return d[0] * 100 + width/2; })
  .attr("y1", function(d) { return d[1] * 100 + width/2; })
  .attr("x2", function(d) { return d[2] * 100 + width/2; })
  .attr("y2", function(d) { return d[3] * 100 + width/2; });

