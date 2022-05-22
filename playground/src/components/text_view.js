import { colors } from '/src/constants.js';

const TextField = class {
  constructor() {};

  addText(str, pageClass, xPos=0, yPos=0, color=colors[2], textSize=45) {
    d3.select(pageClass)
    .append('text')
    .attr('x', xPos)
    .attr('y', yPos)
    .attr('fill', colors[7])
    .style('font-size', textSize)
    .text(str)
  }
}

export { TextField };