import { multiply, mod, add, matrix, inv } from 'mathjs';

const l5 = matrix(
  [[1, 1, 0, 0, 0],
   [1, 1, 1, 0, 0],
   [0, 1, 1, 1, 0],
   [0, 0, 1, 1, 1],
   [0, 0, 0, 1, 1]]
)

const l4 = matrix(
  [[1, 1, 0, 0],
   [1, 1, 1, 0],
   [0, 1, 1, 1],
   [0, 0, 1, 1]]
)

const l54 = matrix(
  [[1, 0, 0, 0, 0],
   [0, 1, 0, 0, 0],
   [0, 0, 1, 0, 0],
   [0, 0, 0, 1, 0]]
)

// inv(l4)*l54
const ls = matrix(
  [[1, 0, 1, 1, 0], // 22
   [0, 0, 1, 1, 0], // 6
   [1, 1, 0, 0, 0], // 24
   [1, 1, 0, 1, 0]] // 26
)

let testLS = mod(multiply(inv(l4), l54), 2)

const vSolution = [1,1,1,1,1]
const basis = ['f1', 'f2', 'f3', 'f4'];

function solution(vect) {
  let sol = multiply(ls, add(vSolution, vect))
  sol = mod(sol, 2)
  return(sol)
};

function lightSolution5(vect) {
  let sol = solution(vect);
  let arr = [];
  sol.forEach(function(x, i) {
    if (x == 1) arr.push(basis[i])
  });
  return(arr)
}

export { ls, solution, lightSolution5, l5 } ;