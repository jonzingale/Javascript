import { ls } from './linear.js';
import '/src/render.js';
import '/src/hypercube.js';
import * as math from 'mathjs';

// returns the basis factorization for the solution vector.
function component(vect = [1,1,1,1,1]) {
  const element = document.createElement('div');
  element.innerHTML =
    math.multiply(ls, vect)
      .map(x => x % 2)
      ._data.join(' ');
  return element;
}

document.body.appendChild(component([0,1,1,0,1]));
