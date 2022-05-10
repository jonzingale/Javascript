import '/src/render.js';
import '/src/hypercube.js';
import '/src/components/lights_example.js';
import { multiply } from 'mathjs';
import { ls, solution, lightSolution } from './lights.js';
import { colors } from '/src/constants.js';

// background
document.body.style.background = '#f8f9fa' // gray-100

// returns the basis factorization for the solution vector.
function component1(vect = [1,1,1,1,1]) {
  const element = document.createElement('div');
  element.innerHTML =
    multiply(ls, vect)
      .map(x => x % 2)
      ._data.join(' ');
  return element;
}

document.body.appendChild(component1([0,1,1,0,1]));
document.body.appendChild(component1([0,1,1,1,0]));

// returns solution to the lights problem as vect
function component2(vect) {
  const element = document.createElement('div');
  let sol = solution(vect);
  element.innerHTML = sol._data.join(' ')
  return element;
}

document.body.appendChild(component2([0,0,1,0,1]));

// returns solution to the lights problem
function component3(vect) {
  const element = document.createElement('div');
  element.innerHTML = lightSolution(vect).join(' ')
  return element;
}

document.body.appendChild(component3([0,0,1,0,1]));