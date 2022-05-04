function component() {
  const element = document.createElement('div');

  element.innerHTML = "Hello Awesome";

  return element;
}

document.body.appendChild(component());