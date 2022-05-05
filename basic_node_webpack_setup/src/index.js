import { matrix } from './matrix.js';

// component :: String
function component() {
  const element = document.createElement('div');
  element.innerHTML = matrix._data.join('<br>');
  return element;
};

document.body.appendChild(component());
