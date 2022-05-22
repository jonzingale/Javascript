import { colors } from '/src/constants.js';

const phi = 0.6180339887498949
const error = 31

let Layout = class {
  constructor() {
    this.left_page_svg()
    this.right_page_svg()
  }

  vertical_pad = () => {
    d3.select("body").append('svg')
      .attr('class', 'vert-pad')
      .attr('width', window.screen.width)
      .attr('height', 0)
  };

  left_page_svg() {
    d3.select("body").append('svg')
      .attr('class', 'left_svg')
      .attr('width', window.screen.width * phi)
      .attr('height', window.screen.height - 155)
      .style('background-color', colors[4])
  }

  right_page_svg() {
    d3.select("body").append('svg')
      .attr('class', 'right_svg')
      .attr('width', window.screen.width * (1 - phi) - error)
      .attr('height', window.screen.height - 155)
      .style('background-color', colors[3])
  }
}

export { Layout };