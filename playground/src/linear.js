import * as math from 'mathjs';

// rotation matrices, quaternions
let t = Math.PI * 3 / 4

let prj = math.matrix([[1,0,0,0],[0,1,0,0]])

let xy_rot = math.matrix([
  [Math.cos(t),Math.sin(t),0,0],
  [-Math.sin(t),Math.cos(t),0,0],
  [0,0,1,0],
  [0,0,0,1]
])

let xz_rot = math.matrix([
  [Math.cos(t),0,-Math.sin(t),0],
  [0,1,0,0],
  [Math.sin(t),0,Math.cos(t),0],
  [0,0,0,1]
])

let yw_rot = math.matrix([
  [1,0,0,0],
  [0,Math.cos(t),0,-Math.sin(t)],
  [0,0,1,0],
  [0,Math.sin(t),0,Math.cos(t)]
])

let xw_rot = math.matrix([
  [1,0,0,0],
  [0,Math.cos(t),-Math.sin(t),0],
  [0,Math.sin(t),Math.cos(t),0],
  [0,0,0,1]
])

// inv(l4)*l54
const ls = math.matrix(
  [[1, 0, 1, 1, 0], // 22
   [0, 0, 1, 1, 0], // 6
   [1, 1, 0, 0, 0], // 24
   [1, 1, 0, 1, 0]] // 26
)

// REDUCTION * yw_rot * xz_rot * xy_rot
let rot = math.multiply(prj, yw_rot, xz_rot, xy_rot)
// or equivalently
const bestRotation = math.matrix([
  [Math.cos(t)**2,Math.cos(t)*Math.sin(t),-Math.sin(t),0],
  [-Math.cos(t)*Math.sin(t),Math.cos(t)**2,0,-Math.sin(t)]
])

export { rot, bestRotation, ls } ;