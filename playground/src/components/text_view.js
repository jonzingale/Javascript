import { colors } from '/src/constants.js';

const TextField = class {
  constructor() {};

  wordWrap(str, elem, fontSize=45) {
    var width = elem.attr('width')
    var offset = 6
    var chunks = this.chunkSubstr(str, fontSize - offset)
    return chunks
  }

  chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
    }

    return chunks
  }

  addText(str, pageClass, xPos=0, yPos=0, color=colors[2], fontSize=45) {
    const elem = d3.select(pageClass)
    const wrapped = this.wordWrap(str, elem, fontSize)
    console.log(wrapped)
    elem.append('g').selectAll('text')
      .data(wrapped)
      .enter().append('text')
      .attr('x', xPos)
      .attr('y', (d, i) => i * fontSize + yPos)
      .attr('fill', colors[7])
      .style('font-size', fontSize)
      .text(d => d)
  }
}

export { TextField };