import { width, height, size, colors } from '/src/constants.js';
import { multiply, mod, add, matrix, column } from 'mathjs';
import { l8 } from '/src/lights.js';

var state = [0,0,0,0,0,0,0,0]
const operations = l8._data

const svg = d3.select("body").append('svg')
  .attr('class', 'lights_container')
  .attr('width', width)
  .attr('height', height)

const lights_container = d3.select(".lights_container")

// Display box
lights_container.append("g").selectAll("box")
  .data([[0,0,1,1]]).enter().append("rect")
  .attr("x", function(d) { return d[0] + 0; })
  .attr("y", function(d) { return d[1] + width/3; })
  .attr("width", function(d) { return d[2] * width; })
  .attr("height", function(d) { return d[3] * height/4; })
  .attr("stroke", colors[2])
  .attr('fill', colors[6]);

var lights = lights_container.append("g").selectAll("light")
  .data(state).enter().append("circle")
  .attr("id", function(d, i) { return i })
  .attr("cx", function(d, i) { return (i * width/8 + 25)  })
  .attr("cy", height/2)
  .attr("r", 18)
  .attr('stroke', colors[7])
  .attr('stroke-width', 3)
  .attr('fill', colors[9]);

lights_container.append("g").selectAll("text")
.data(state).enter()
  .append('text')
  .attr('x', function(d, i) { return (i * width/8 + 17)  })
  .attr('y', height/2.3)
  .attr('stroke', colors[0])
  .style("font-size", 21)
  .text(function(d, i) { return `f${i+1}` })

// Do color logic
d3.selectAll('circle')
  .on('click', function() {
    // lights logic
    state = mod(add(state, operations[this.id]), 2)
    // modify lights
    lights.data(state).style('fill', function() {
        let color = state[this.id] == 0 ? colors[9] : colors[0]
        return color
      })
  });

export { svg };