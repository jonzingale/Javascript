import { width, height, size } from '/src/constants.js';
import { hypercube } from '/src/hypercube.js';

let cube_height = 80
let cube_width = width/1.8

let Cube = class {
  constructor() {
    this.points = hypercube.points
    this.lines = hypercube.lines
    this.displayCube()
  }

  displayCube() {
    var svg = d3.select("body").append('svg')
      .attr('class', 'cube_container')
      .attr('width', width)
      .attr('height', 190)

    svg.selectAll("pts")
      .data(this.points).enter().append("circle")
      .attr("cx", function(d) { return (size * d[0] + cube_width)  })
      .attr("cy", function(d) { return (size * d[1] + cube_height) })
      .attr("r", 5);

    svg.append("g").selectAll("line")
      .data(this.lines).enter().append("line").attr("stroke", "black")
      .attr("x1", function(d) { return d[0] * size + cube_width; })
      .attr("y1", function(d) { return d[1] * size + cube_height; })
      .attr("x2", function(d) { return d[2] * size + cube_width; })
      .attr("y2", function(d) { return d[3] * size + cube_height; });
  }
}

export { Cube };