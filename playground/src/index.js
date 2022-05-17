import { Cube} from '/src/components/render_cube.js';
import { LightBox } from '/src/components/render_lights.js';
import { Button } from '/src/components/render_buttons.js';

// background
document.body.style.background = '#f8f9fa' // gray-100

// pad top
d3.select("body").append('svg')
  .attr('class', 'top-pad')
  .attr('width', 1000)
  .attr('height', 100)

// initialize cube
new Cube()

// initialize light box and buttons
var lights = new LightBox()
var buttons = new Button()
initialize()

function initialize() {
  buttons.initializeSetter()
  lights.randomizeState()
  lights.displayLabels()
  lights.displayLights()
  lights.displayHints()
}

// render interactive lights
lights.container.selectAll('circle')
  .on('click', function() {
    if (buttons.setterState.set) {
      lights.updateState(this.id)
      lights.displayHints()
      lights.displayLights()
    } else {
      lights.updateLight(this.id)
      lights.displayLights()
    }
  });

// render random button
buttons.container.selectAll('.random_button')
  .on('click', () => initialize());

// render setter button
buttons.container.selectAll('.setter_button')
  .on('click', function() {
    buttons.setState()
    if (buttons.setterState.set) {
      lights.displayHints()
      lights.displayLabels()
    } else {
      lights.hideHints()
      lights.hideLabels()
    }
  }
);
