import { matrix, multiply } from 'mathjs';

// rotation matrices, quaternions
let t = Math.PI * 3 / 4

let prj = matrix([[1,0,0,0],[0,1,0,0]])

let xy_rot = matrix([
  [Math.cos(t),Math.sin(t),0,0],
  [-Math.sin(t),Math.cos(t),0,0],
  [0,0,1,0],
  [0,0,0,1]
])

let xz_rot = matrix([
  [Math.cos(t),0,-Math.sin(t),0],
  [0,1,0,0],
  [Math.sin(t),0,Math.cos(t),0],
  [0,0,0,1]
])

let yw_rot = matrix([
  [1,0,0,0],
  [0,Math.cos(t),0,-Math.sin(t)],
  [0,0,1,0],
  [0,Math.sin(t),0,Math.cos(t)]
])

let xw_rot = matrix([
  [1,0,0,0],
  [0,Math.cos(t),-Math.sin(t),0],
  [0,Math.sin(t),Math.cos(t),0],
  [0,0,0,1]
])

// REDUCTION * yw_rot * xz_rot * xy_rot
let rot = multiply(prj, yw_rot, xz_rot, xy_rot)
// or equivalently
const rotation = matrix([
  [Math.cos(t)**2,Math.cos(t)*Math.sin(t),-Math.sin(t),0],
  [-Math.cos(t)*Math.sin(t),Math.cos(t)**2,0,-Math.sin(t)]
])

export { rot, rotation } ;