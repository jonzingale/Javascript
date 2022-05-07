import { width, height } from './constants.js';

var svg = d3.select("body").append('svg')
  .attr('class', 'container')
  .attr('width', width)
  .attr('height', height)

export { svg };