import { Cube } from '/src/components/cube_view.js';
import { LightBox } from '/src/components/lights_view.js';
import { Button } from '/src/components/buttons_view.js';
import { Layout } from '/src/components/layout_view.js'

// background
document.body.style.background = '#f8f9fa' // gray-100

// define page layout
const layout = new Layout()
var leftPage = layout.left_page_svg()
var rightPage = layout.right_page_svg()

// some text
layout.addText('Something very lorem ipsum here.', '.right_svg', 100, 50)

// initialize cube, attach to layout, display
const cube1 = new Cube()
layout.addComponent(cube1, '.left_svg', 0, 50)
cube1.displayCube()

const cube2 = new Cube()
layout.addComponent(cube2, '.left_svg', 300, 50)
cube2.displayCube()

// // initialize light box and buttons
const lights = new LightBox()
layout.addComponent(lights, '.left_svg', 150, 300)
lights.initializeLights()

var buttons = new Button()
layout.addComponent(buttons, '.right_svg', 0, 300)
buttons.initializeButtons()
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
