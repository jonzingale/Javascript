import { width, height, colors } from '/src/constants.js';

let Button = class {
  constructor() {
    this.container = this.getContainer()
    this.randomButton = this.getRandomizeButton()
    this.setterText = this.getSetterButton()
    this.setterState = { 'set' : true }
  };

  getContainer() {
    d3.select("body").append('svg')
      .attr('class', 'buttons_container')
      .attr('width', 200)
      .attr('height', 500)

    var container = d3.select(".buttons_container")

    container.append("g").selectAll("box")
      .data([[0,0,1,1]]).enter().append("rect")
      .attr("x", d => d[0] + 0)
      .attr("y", d => d[1] + height/3)
      .attr("width", d => d[2] * width)
      .attr("height", d => d[3] * height/3.5)
      .attr('fill', colors[6]);

    return(container)
  }

  getRandomizeButton() {
    // circular button
    var randB = this.container.append("g")
      .selectAll("random_button").data([1]).enter()
      .append("circle")
      .attr('class', 'random_button')
      .attr("cx", 30)
      .attr("cy", 270)
      .attr("r", 18)
      .attr('stroke', colors[7])
      .attr('stroke-width', 3)
      .attr('fill', colors[1])

    // text
    this.container.append('g')
      .selectAll("rand_text")
      .data([0]).enter()
      .append('text')
      .attr('x', 60)
      .attr('y', 277)
      .attr('fill', colors[9])
      .style('font-size', 25)
      .text('Randomize')

    return(randB)
  }

  getSetterButton() {
    // circular button
    var setB = this.container.append("g")
      .selectAll("setter_button").data([1]).enter()
      .append("circle")
      .attr('class', 'setter_button')
      .attr("cx", 30)
      .attr("cy", 210)
      .attr("r", 18)
      .attr('stroke', colors[7])
      .attr('stroke-width', 3)
      .attr('fill', colors[5])

    // text
    var setter_text = this.container.append('g')
      .selectAll("setter_text")
      .data([0]).enter()
      .append('text')
      .attr('x', 60)
      .attr('y', 220)
      .attr('fill', colors[9])
      .style('font-size', 25)

    setter_text.text('Set Lights')

    return(setter_text)
  }

  // toggles between setter and solver
  setState() {
    if (this.setterState) {
      this.setterText.text('Solve Lights')
      this.setterState = false
    } else {
      this.setterText.text('Set Lights')
      this.setterState = true
    }
  }

}

export { Button };