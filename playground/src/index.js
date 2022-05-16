import '/src/components/render_cube.js';
import { LightBox } from '/src/components/render_lights.js';
import { width, height, colors } from '/src/constants.js';
import { hasSolution } from '/src/eight_lights.js'
import { Button } from '/src/components/render_buttons.js';

// background
document.body.style.background = '#f8f9fa' // gray-100

// initialize light box and buttons
var lights = new LightBox()
var buttons = new Button()

function main() {
  lights.randomizeState()
  lights.displayLabels()
  lights.displayLights()
  lights.displayHints()

  // render interactive lights
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
  buttons.container.selectAll('.random_button')
    .on('click', function() {
      lights.container.selectAll('text').remove()
      main()
    });

  // render setter button
  buttons.container.selectAll('.setter_button')
    .on('click', function() { buttons.setState() });
}

main()
