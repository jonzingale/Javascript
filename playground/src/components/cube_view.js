import { HyperCube } from '/src/hypercube.js';

let Cube = class {
  constructor(elem, xPos, yPos) {
    this.elem = elem
    this.xPos = xPos
    this.yPos = yPos

    this.displayCube()
  }

  displayCube() {
    let size = 100
    let cube_height = 80
    let cube_width = 278
    let hypercube = new HyperCube()
    let nodes = hypercube.nodes
    let edges = hypercube.edges

    var svg = d3.select(this.elem)

    svg.append("g").selectAll("pts")
      .data(nodes).enter().append("circle")
      .attr("cx", d => size * d[0] + cube_width + this.xPos)
      .attr("cy", d => size * d[1] + cube_height + this.yPos)
      .attr("r", 5);

    svg.append("g").selectAll("line")
      .data(edges).enter().append("line").attr("stroke", "black")
      .attr("x1", d => d[0] * size + cube_width + this.xPos)
      .attr("y1", d => d[1] * size + cube_height + this.yPos)
      .attr("x2", d => d[2] * size + cube_width + this.xPos)
      .attr("y2", d => d[3] * size + cube_height + this.yPos);
  }
}

export { Cube };