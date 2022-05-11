import { multiply, mod, add, matrix, inv } from 'mathjs';

const l4 = matrix(
  [[1, 1, 0, 0], // 12
   [1, 1, 1, 0], // 14
   [0, 1, 1, 1], // 7
   [0, 0, 1, 1]] // 3
)

const l54 = matrix(
  [[1, 0, 0, 0, 0], // 16
   [0, 1, 0, 0, 0], // 8
   [0, 0, 1, 0, 0], // 4
   [0, 0, 0, 1, 0]] // 2
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

function lightSolution(vect) {
  let sol = solution(vect);
  let arr = [];
  sol.forEach(function(x, i) {
    if (x == 1) arr.push(basis[i])
  });
  return(arr)
}

export { ls, solution, lightSolution } ;