import { width, height, size } from '/src/constants.js';
import { HyperCube } from '/src/hypercube.js';

let cube_height = 80
let cube_width = width/1.8

let Cube = class {
  constructor() {
    hypercube = new HyperCube()
    this.nodes = hypercube.nodes
    this.edges = hypercube.edges
    this.displayCube()
  }

  displayCube() {
    var svg = d3.select("body").append('svg')
      .attr('class', 'cube_container')
      .attr('width', width)
      .attr('height', 190)

    svg.selectAll("pts")
      .data(this.nodes).enter().append("circle")
      .attr("cx", d => size * d[0] + cube_width)
      .attr("cy", d => size * d[1] + cube_height)
      .attr("r", 5);

    svg.append("g").selectAll("line")
      .data(this.edges).enter().append("line").attr("stroke", "black")
      .attr("x1", d => d[0] * size + cube_width)
      .attr("y1", d => d[1] * size + cube_height)
      .attr("x2", d => d[2] * size + cube_width)
      .attr("y2", d => d[3] * size + cube_height);
  }
}

export { Cube };
