import { width, height, size, colors } from '/src/constants.js';
import { lightSolution, l8, hasSolution } from '/src/eight_lights.js';
import { lightSolution5, l5 } from '/src/four_lights.js';
import { range, zeros } from '/src/helpers.js';
import { mod, add } from 'mathjs';

let LightBox = class {
  constructor(state) {
    this.state = zeros(8)
    this.range = range(8)
    this.operations = l8._data
    this.container = this.getContainer()
    this.hints = this.getHints()
    this.lights = this.getLights()
    this.labels = this.getLabels()
  }

 // randomize initial state
  randomizeState() {
    this.state = this.state.map(x => Math.floor(Math.random() * 2))
  }

  setLight(id) {
    this.state[id] = (this.state[id] + 1) % 2
  }

  updateState(id) {
    this.state = mod(add(this.state, this.operations[id]), 2)
  }

  getContainer() {
    d3.select("body").append('svg')
      .attr('class', 'lights_container')
      .attr('width', width)
      .attr('height', height)

    var container = d3.select(".lights_container")

    container.append("g").selectAll("box")
      .data([[0,0,1,1]]).enter().append("rect")
      .attr("x", d => d[0] + 0)
      .attr("y", d => d[1] + width/3)
      .attr("width", d => d[2] * width)
      .attr("height", d => d[3] * height/3.5)
      // .attr("stroke", colors[2])
      .attr('fill', colors[6]);

    return container;
  }

  getLabels() {
    var labels = this.container.append('g').selectAll('labels')
    return labels;
  }

  hideLabels() {
    this.container.selectAll('text').remove()
  }

  displayLabels() {
    // clear any labels before render
    this.hideLabels()

    if (hasSolution(this.state)) {
      this.labels
        .data(this.state).enter()
        .append('text')
        .attr('x', (d, i) => i * width/8.2 + 28)
        .attr('y', height/2.45)
        .attr('fill', colors[0])
        .style('font-size', 23)
        .text((d, i) => i+1)
    } else {
      this.labels
        .data([0]).enter()
        .append('text')
        .attr('x', width/3)
        .attr('y', height/2.45)
        .attr('fill', colors[9])
        .style('font-size', 30)
        .text('No Solutions')
    }
  }

  getHints() {
    var hints = this.container.append("g").selectAll("hint")
      .data(this.range).enter().append("ellipse")
      .attr("cx", d => d * width/8.2 + 34)
      .attr("cy", height/2)
      .attr("rx", 22)
      .attr("ry", 35)
      .attr('fill', colors[6]);

    return hints;
  }

  displayHints() {
    let solution = lightSolution(this.state);
    let hasSol = hasSolution(this.state)

    this.hints.style('fill', (d, i) =>
      (solution.includes(i) && hasSol) ? 'gold' : colors[6]
    )
  }

  hideHints() {
    this.hints.style('fill', colors[6])
  }

  getLights() {
    var lights = this.container.append("g").selectAll("light")
      .data(this.range).enter().append("circle")
      .attr("id", d => d)
      .attr("cx", d => d * width/8.2 + 34)
      .attr("cy", height/2)
      .attr("r", 18)
      .attr('stroke', colors[7])
      .attr('stroke-width', 3)
      .attr('fill', colors[9]);

    return lights;
  }

  displayLights() {
    this.lights.data(this.state)
      .style('fill', d => d == 0 ? colors[9] : colors[0])
  }
}

export { LightBox };