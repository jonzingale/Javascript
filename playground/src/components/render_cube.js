import { width, height, size } from '/src/constants.js';
import { hypercube } from '/src/hypercube.js';

let points = hypercube.points
let lines = hypercube.lines

var svg = d3.select("body").append('svg')
  .attr('class', 'container')
  .attr('width', width)
  .attr('height', height)

// Display hypercube
d3.select(".container").selectAll("pts")
  .data(points).enter().append("circle")
  .attr("cx", function(d) { return (size * d[0] + width/2)  })
  .attr("cy", function(d) { return (size * d[1] + height/2) })
  .attr("r", 10);

d3.select(".container").append("g").selectAll("line")
  .data(lines).enter().append("line").attr("stroke", "black")
  .attr("x1", function(d) { return d[0] * size + width/2; })
  .attr("y1", function(d) { return d[1] * size + height/2; })
  .attr("x2", function(d) { return d[2] * size + width/2; })
  .attr("y2", function(d) { return d[3] * size + height/2; });

export { svg };