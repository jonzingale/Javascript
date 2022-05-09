import { width, height, size } from './constants.js';
import { hypercube } from './hypercube.js';

let points = hypercube.points
let lines = hypercube.lines

var svg = d3.select("body").append('svg')
  .attr('class', 'container_lights')
  .attr('width', width)
  .attr('height', height)

// Display hypercube
d3.select("svg").append("g").selectAll("box")
  .data([[0,0,1,1]]).enter().append("rect")
  .attr("stroke", "black")
  .attr("strokeWidth", "5")
  .attr("x1", function(d) { return d[0] * 100; })
  .attr("y1", function(d) { return d[1] * 100; })
  .attr("x2", function(d) { return d[2] * 100; })
  .attr("y2", function(d) { return d[3] * 100; });

export { svg };