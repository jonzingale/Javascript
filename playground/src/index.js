import { pad_top } from '/src/components/style_elements.js'
// import { Cube } from '/src/components/render_cube.js';
import { Cube } from '/src/components/cube_view.js';
import { LightBox } from '/src/components/render_lights.js';
import { Button } from '/src/components/render_buttons.js';

//
import { Layout } from '/src/components/layout_view.js'

// background
document.body.style.background = '#f8f9fa' // gray-100

// pad top
// pad_top()

const layout = new Layout()
var leftPage = layout.left_page_svg()
var rightPage = layout.right_page_svg()

layout.addText('Something very ipsum lorum here.', '.left_svg', 100, 300)

// // initialize cube
const cube1 = new Cube()
layout.addComponent(cube1, '.left_svg', 0, 50)
cube1.displayCube()

const cube2 = new Cube()
layout.addComponent(cube2, '.left_svg', 300, 50)
cube2.displayCube()

// // initialize light box and buttons
// var lights = new LightBox()
// var buttons = new Button()
// initialize()

// function initialize() {
//   buttons.initializeSetter()
//   lights.randomizeState()
//   lights.displayLabels()
//   lights.displayLights()
//   lights.displayHints()
// }

// // render interactive lights
// lights.container.selectAll('circle')
//   .on('click', function() {
//     if (buttons.setterState.set) {
//       lights.updateState(this.id)
//       lights.displayHints()
//       lights.displayLights()
//     } else {
//       lights.updateLight(this.id)
//       lights.displayLights()
//     }
//   });

// // render random button
// buttons.container.selectAll('.random_button')
//   .on('click', () => initialize());

// // render setter button
// buttons.container.selectAll('.setter_button')
//   .on('click', function() {
//     buttons.setState()
//     if (buttons.setterState.set) {
//       lights.displayHints()
//       lights.displayLabels()
//     } else {
//       lights.hideHints()
//       lights.hideLabels()
//     }
//   }
// );
