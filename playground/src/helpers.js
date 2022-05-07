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

const toBin = function(pad, num) {
  let bin = (num >>> 0).toString(2).padStart(pad, '0').split('')
  return(bin)
}

export { zeros, range, rootsUnity, toBinary, toBin };
