import { matrix } from './matrix.js';

function component() {
  const element = document.createElement('div');
  element.innerHTML = String(m1).join('<br>');
  return element;
}

document.body.appendChild(component1());
