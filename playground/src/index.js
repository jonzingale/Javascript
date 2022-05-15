import '/src/components/render_cube.js';
import { LightBox } from '/src/components/render_lights.js';
import { width, height, colors } from '/src/constants.js';
import { hasSolution } from '/src/eight_lights.js'
import { Button } from '/src/components/render_buttons.js';

// background
document.body.style.background = '#f8f9fa' // gray-100
var lights = new LightBox()
var button = new Button()

function main() {
  // initialize light box and buttons
  lights = new LightBox() // super buggy on randomize :(
  button.getRandomizeButton()

  lights.randomizeState()
  lights.displayLights()

  if (hasSolution(lights.state)) {
    // label lights
    lights.displayLabels()
    // show hints
    lights.displayHints()
  } else {
    // remove number labels
    lights.labels.remove()
    // return no solutions
    d3.selectAll('.hints').remove()
    lights.displayNoSolutions()
  }

  // render lights
  lights.container.selectAll('circle')
    .on('click', function() {
      // lights logic
      lights.updateState(this.id)
      // modify hints
      lights.displayHints()
      // modify lights
      lights.displayLights()
    });

  // render random button
  button.container.selectAll('.random_button')
    .on('click', function() { main() });

  // render setter button
  button.container.selectAll('.setter_button')
    .on('click', function() { button.setState() });
}

main()


// hmm, scope creep
// randomize_button.on('click', function() {
  // d3.selectAll('.numbers').remove()
  // d3.selectAll('.noSolutions').remove()
  // main()
// });
