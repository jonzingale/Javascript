import * as math from 'mathjs';

const zeros = function(n) {
  let zs = [...Array(n).keys()].map(x => 0);
  return(zs);
}

const range = function(n) { return([...Array(n).keys()]) };

const rootsUnity = function(n) {
  let rs = range(n).map(x =>
    [Math.cos(2*Math.PI*x/n), Math.sin(2*Math.PI*x/n)]
  );
  return(rs);
}

const toBinary = function(n=0, bin=[]) {
  if (n == 0) { bin = [0] };
  while (n > 0) {
    bin.unshift(n % 2);
    n = Math.floor(n / 2);
  };
  return(bin);
};

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

// REDUCTION * yw_rot * xz_rot * xy_rot
let rot = math.multiply(prj, yw_rot, xz_rot, xy_rot)
// or equivalently
const rot_simp = math.matrix([
  [Math.cos(t)**2,Math.cos(t)*Math.sin(t),-Math.sin(t),0],
  [-Math.cos(t)*Math.sin(t),Math.cos(t)**2,0,-Math.sin(t)]
])

export { zeros, range, rootsUnity, rot, rot_simp, toBinary };
