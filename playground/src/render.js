import { m1, m2, ls, i4 } from './linear.js';

const dot = d3.select("body")
  .selectAll("dot")
  .data([4, 8, 15, 16, 23, 42]).enter().append("div")
  .text(function(d) { return d; });

export { dot };