import { colors } from '/src/constants.js';

const phi = 0.6180339887498949
const error = 31

let Layout = class {
  constructor() {}

  left_page_svg() {
    d3.select("body").append('svg')
      .attr('class', 'left_svg')
      .attr('width', window.screen.width * phi)
      .attr('height', window.screen.height - 200)
      .style('background-color', colors[4])
  }

  right_page_svg() {
    d3.select("body").append('svg')
      .attr('class', 'right_svg')
      .attr('width', window.screen.width * (1 - phi) - error)
      .attr('height', window.screen.height - 200)
      .style('background-color', colors[3])
  }

  addText(str, pageClass, xPos=0, yPos=0, color=colors[2]) {
    d3.select(pageClass)
    .append('text')
    .attr('x', xPos)
    .attr('y', yPos)
    .attr('fill', colors[7])
    .style('font-size', 45)
    .text(str)
  }

  // Todo: work this out somehow.
  addComponent(comp, pageClass, xPos=0, yPos=0) {
    comp.elem = pageClass
    comp.xPos = xPos
    comp.yPos = yPos
  }
}

export { Layout };