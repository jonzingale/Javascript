import { Cube } from '/src/components/cube_view.js';
import { LightBox } from '/src/components/lights_view.js';
import { Button } from '/src/components/buttons_view.js';
import { Layout } from '/src/components/layout_view.js'
import { TextField } from '/src/components/text_view.js';

// define page layout and text field
const layout = new Layout()
const textField = new TextField()

// some text
textField.addText(
  'Something very lorem ipsum here.',
  '.left_svg', 100, 100, 45
)

// initialize cube, attach to layout, display
const cube1 = new Cube('.left_svg', 0, 150)
const cube2 = new Cube('.left_svg', 300, 150)

// // initialize light box and buttons
const lights = new LightBox('.left_svg', 50, 400)
const buttons = new Button('.left_svg', 560, 400)
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
