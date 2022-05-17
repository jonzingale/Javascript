import { width, height, size } from '/src/constants.js';
import { hypercube } from '/src/hypercube.js';

let Cube = class {
  constructor() {
    this.points = hypercube.points
    this.lines = hypercube.lines
    this.displayCube()
  }

  displayCube() {
    var svg = d3.select("body").append('svg')
      .attr('class', 'container')
      .attr('width', width + 30)
      .attr('height', 250)

    // Display hypercube
    d3.select(".container").selectAll("pts")
      .data(this.points).enter().append("circle")
      .attr("cx", function(d) { return (size * d[0] + width/2)  })
      .attr("cy", function(d) { return (size * d[1] + 100) })
      .attr("r", 5);

    d3.select(".container").append("g").selectAll("line")
      .data(this.lines).enter().append("line").attr("stroke", "black")
      .attr("x1", function(d) { return d[0] * size + width/2; })
      .attr("y1", function(d) { return d[1] * size + 100; })
      .attr("x2", function(d) { return d[2] * size + width/2; })
      .attr("y2", function(d) { return d[3] * size + 100; });
  }
}

export { Cube };