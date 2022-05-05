import { m1, m2, ls, i4 } from './linear.js';
import * as math from 'mathjs';

function component1() {
  const element = document.createElement('div');
  element.innerHTML = m1._data.join('<br>') + '<p>';
  return element;
}

// returns the basis factorization for the solution vector.
function component2(vect = [1,1,1,1,1]) {
  const element = document.createElement('div');
  element.innerHTML =
    math.multiply(ls, vect)
        .map(x => x % 2)
        ._data.join(' ');
  return element;
}

window.m1 = m1;
window.inv = math.inv;
window.m2 = m2;
window.i4 = i4;
window.pp = math.multiply;

document.body.appendChild(component1());
document.body.appendChild(component2([0,1,1,0,1]));