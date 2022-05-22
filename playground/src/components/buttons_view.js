import { width, height, colors } from '/src/constants.js';

let Button = class {
  constructor(elem, xPos, yPos) {
    this.elem = elem
    this.xPos = xPos
    this.yPos = yPos
  };

  initializeButtons() {
    this.container = this.getContainer()
    this.randomButton = this.getRandomizeButton()
    this.setterText = this.getSetterButton()
    this.setterState = { 'set' : true }
  }

  getContainer() {
    var svg = d3.select(this.elem)

    svg.append("g").selectAll("box")
      .data([0,0,0,0]).enter().append("rect")
      .attr("x", this.xPos)
      .attr("y", this.yPos)
      .attr("width", width)
      .attr("height", height)
      .attr('fill', colors[6]);

    return svg
  }

  getRandomizeButton() {
    // circular button
    var randB = this.container.append("g")
      .selectAll("random_button").data([1]).enter()
      .append("circle")
      .attr('class', 'random_button')
      .attr("cx", 30 + this.xPos)
      .attr("cy", 104 + this.yPos)
      .attr("r", 18)
      .attr('stroke', colors[7])
      .attr('stroke-width', 3)
      .attr('fill', colors[1])

    // text
    this.container.append('g')
      .selectAll("rand_text")
      .data([0]).enter()
      .append('text')
      .attr('x', 60 + this.xPos)
      .attr('y', 111 + this.yPos)
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
      .attr("cx", 30 + this.xPos)
      .attr("cy", 44 + this.yPos)
      .attr("r", 18)
      .attr('stroke', colors[7])
      .attr('stroke-width', 3)
      .attr('fill', colors[5])

    // text
    var setter_text = this.container.append('g')
      .selectAll("setter_text")
      .data([0]).enter()
      .append('text')
      .attr('x', 60 + this.xPos)
      .attr('y', 54 + this.yPos)
      .attr('fill', colors[9])
      .style('font-size', 25)

    return(setter_text)
  }

  initializeSetter() {
    this.setterText.text('Set Lights')
    this.setterState.set = true
  }

  // toggles between setter and solver
  setState() {
    this.setterState.set ^= true;
    var str = this.setterState.set ? 'Set Lights' : 'Solve Lights'
    this.setterText.text(str)
  }

}

export { Button };