import { multiply, mod, add, matrix, inv, det } from 'mathjs';

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
[[1, 0, 1, 1, 0, 1, 1],
 [0, 0, 1, 1, 0, 1, 1],
 [1, 1, 0, 0, 0, 0, 0],
 [1, 1, 0, 1, 0, 1, 1],
 [0, 0, 0, 0, 0, 1, 1],
 [1, 1, 0, 1, 1, 0, 0],
 [1, 1, 0, 1, 1, 0, 1]]
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
[[1, 0, 1, 1, 0, 1, 1, 0],
 [0, 0, 1, 1, 0, 1, 1, 0],
 [1, 1, 0, 0, 0, 0, 0, 0],
 [1, 1, 0, 1, 0, 1, 1, 0],
 [0, 0, 0, 0, 0, 1, 1, 0],
 [1, 1, 0, 1, 1, 0, 0, 0],
 [1, 1, 0, 1, 1, 0, 1, 0]]
)

const vSolution = [1,1,1,1,1,1,1,1]
const basis = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'];

function solution(vect) {
  let sol = multiply(solution8, add(vSolution, vect))
  sol = mod(sol, 2)
  return(sol)
};

function lightSolution(vect) {
  let sol = solution(vect);
  let arr = [];
  sol.forEach(function(x, i) {
    if (x == 1) arr.push(basis[i])
  });
  return(arr)
}

export { solution, lightSolution, l8, solution8 } ;