import { multiply, mod, add, matrix, inv, diag, resize,
  chain, ones } from 'mathjs';

// 7 + 5 + 4 + 2 + 1 = 8
const l8 = matrix(
  [
   [1, 1, 0, 0, 0, 0, 0, 0],
   [1, 1, 1, 0, 0, 0, 0, 0],
   [0, 1, 1, 1, 0, 0, 0, 0],
   [0, 0, 1, 1, 1, 0, 0, 0],
   [0, 0, 0, 1, 1, 1, 0, 0],
   [0, 0, 0, 0, 1, 1, 1, 0],
   [0, 0, 0, 0, 0, 1, 1, 1],
   [0, 0, 0, 0, 0, 0, 1, 1],
  ]
)

const l7 = matrix(
  [
   [1, 1, 0, 0, 0, 0, 0],
   [1, 1, 1, 0, 0, 0, 0],
   [0, 1, 1, 1, 0, 0, 0],
   [0, 0, 1, 1, 1, 0, 0],
   [0, 0, 0, 1, 1, 1, 0],
   [0, 0, 0, 0, 1, 1, 1],
   [0, 0, 0, 0, 0, 1, 1],
  ]
)

const invL7 = matrix(
  [
   [1, 0, 1, 1, 0, 1, 1],
   [0, 0, 1, 1, 0, 1, 1],
   [1, 1, 0, 0, 0, 0, 0],
   [1, 1, 0, 1, 0, 1, 1],
   [0, 0, 0, 0, 0, 1, 1],
   [1, 1, 0, 1, 1, 0, 0],
   [1, 1, 0, 1, 1, 0, 1]
  ]
)

const l87 = matrix(
  [
   [1, 0, 0, 0, 0, 0, 0, 0],
   [0, 1, 0, 0, 0, 0, 0, 0],
   [0, 0, 1, 0, 0, 0, 0, 0],
   [0, 0, 0, 1, 0, 0, 0, 0],
   [0, 0, 0, 0, 1, 0, 0, 0],
   [0, 0, 0, 0, 0, 1, 0, 0],
   [0, 0, 0, 0, 0, 0, 1, 0]
  ]
)

// inv(l7)*l87
const solution8 = matrix(
[
  [1, 0, 1, 1, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [1, 1, 0, 1, 1, 0, 0, 0],
  [1, 1, 0, 1, 1, 0, 1, 0]
 ]
)

const vSolution = ones(8)
const basis = [0,1,2,3,4,5,6];

function solution(vect) {
  let sol = mod(multiply(solution8, add(vSolution, vect)), 2)
  return(sol)
};

function lightSolution(vect) {
  let sol = solution(vect);
  let arr = []
  sol.forEach((x, i) => (x == 1) ? arr.push(basis[i]) : null )
  return(arr)
}

function hasSolution(vect) {
  let v7 = solution(vect); // solution in V7
  let v8 = resize(v7, [8], 0) // resize solution to be in V8
  let bs = multiply(diag(v8), l8) // select bases in V8
  let summedBs = bs._data.reduce((i, a) => add(i, a), 0)
  let hasSol = chain(vect).add(summedBs).mod(2).done().pop() === 1
  return(hasSol)
}

export { lightSolution, hasSolution, l8 } ;
