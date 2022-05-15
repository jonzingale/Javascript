import '/src/components/render_cube.js';
import { lights_container, state, displayHints,
  displayLights, hasSolution } from '/src/components/render_lights.js';
import { width, height, colors } from '/src/constants.js';

// background
document.body.style.background = '#f8f9fa' // gray-100

displayLights()
if (hasSolution(state)) {
  // label lights
  lights_container.append("g").selectAll("text")
  .data(state).enter()
    .append('text')
    .attr('x', (d, i) => i * width/8.2 + 28)
    .attr('y', height/2.45)
    .attr('fill', colors[0])
    .style("font-size", 23)
    .text((d, i) => i+1)
  // show hints
  displayHints()
} else {
  // return no solutions
  lights_container.append("g")
    .append('text')
    .attr('x', width/3)
    .attr('y', height/2.45)
    .attr('fill', colors[9])
    .style("font-size", 30)
    .text("No Solutions")
}