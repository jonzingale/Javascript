import { width, height, size, colors } from '/src/constants.js';
import { lightSolution, l8 } from '/src/eight_lights.js';
import { mod, add } from 'mathjs';

const operations = l8._data
var state = [0,0,0,0,0,0,0,0]

 // randomize initial state
state = state.map(x => Math.floor(Math.random() * 2))

const svg = d3.select("body").append('svg')
  .attr('class', 'lights_container')
  .attr('width', width)
  .attr('height', height)

const lights_container = d3.select(".lights_container")

lights_container.append("g").selectAll("box")
  .data([[0,0,1,1]]).enter().append("rect")
  .attr("x", function(d) { return d[0] + 0; })
  .attr("y", function(d) { return d[1] + width/3; })
  .attr("width", function(d) { return d[2] * width; })
  .attr("height", function(d) { return d[3] * height/4; })
  // .attr("stroke", colors[2])
  .attr('fill', colors[6]);

var hints = lights_container.append("g").selectAll("hint")
  .data(state).enter().append("ellipse")
  .attr("id", function(d, i) { return i })
  .attr("cx", function(d, i) { return (i * width/8.2 + 30)  })
  .attr("cy", height/2)
  .attr("rx", 22)
  .attr("ry", 35)
  .attr('fill', colors[6]);

var lights = lights_container.append("g").selectAll("light")
  .data(state).enter().append("circle")
  .attr("id", function(d, i) { return i })
  .attr("cx", function(d, i) { return (i * width/8.2 + 30)  })
  .attr("cy", height/2)
  .attr("r", 18)
  .attr('stroke', colors[7])
  .attr('stroke-width', 3)
  .attr('fill', colors[9]);

lights_container.append("g").selectAll("text")
.data(state).enter()
  .append('text')
  .attr('x', function(d, i) { return (i * width/8.2 + 24)  })
  .attr('y', height/2.5)
  .attr('fill', colors[0])
  .style("font-size", 23)
  .text(function(d, i) { return i+1 })

function displayHints() {
  hints.data(state).style('fill', function(d, i) {
    let hs = lightSolution(state);
    let color = hs.includes(i) ? 'gold' : colors[6];
    return color;
  })
}

function displayLights() {
  lights.data(state).style('fill', function(d) {
    let color = d == 0 ? colors[9] : colors[0];
    return color;
  })
}

function updateState(id) {
  state = mod(add(state, operations[id]), 2)
}

// instantiate hints
displayHints()
displayLights()

// do logic on click
d3.selectAll('circle')
  .on('click', function() {
    // lights logic
    updateState(this.id)
    // modify hints
    displayHints()
    // modify lights
    displayLights()
  });

export { svg };