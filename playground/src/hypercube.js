import * as math from 'mathjs';
import { floor, cos, sin, PI} from 'mathjs';
import { range, bestRotation } from './helpers.js';
import { width, height } from './constants.js';
import { m1, m2, ls, i4 } from './linear.js';

const size = 100;
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

const points = function(n) {
  let ps = []
  let bins = range(2**n).map(function(x) {
    let pt = (x >>> 0).toString(2)
      .padStart(4, '0').split('')
    return(pt);
  });
  return(bins);
};

let hc = math.transpose(math.matrix(points(4)))
let ps = math.multiply(bestRotation, hc)
let rows = math.transpose(ps)

const cube = d3.select("svg").selectAll("pts")
  .data(rows._data).enter().append("circle")

cube.attr("cx", function(d) { return (size * d[0] + width/2)  });
cube.attr("cy", function(d) { return (size * d[1] + height/2) });
cube.attr("r", 3);

let newCoords = []
coords.forEach(function(vs) {
  let v = math.transpose(vs)
  let rs = math.multiply(bestRotation, v)
  let l1 = math.transpose(rs)
  newCoords.push(l1._data.flat())
})

const lines = d3.select("svg").append("g").selectAll("line")
  .data(newCoords).enter().append("line").attr("stroke", "black")
  .attr("x1", function(d) { return d[0] * size + width/2; })
  .attr("y1", function(d) { return d[1] * size + height/2; })
  .attr("x2", function(d) { return d[2] * size + width/2; })
  .attr("y2", function(d) { return d[3] * size + height/2; });

