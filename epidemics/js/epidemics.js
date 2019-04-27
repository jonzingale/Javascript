// SERVER on 8000: python -m http.server
import { genNamedVectors, updateSusceptible,
         updateRecovered, pp} from './algebraicGraph.js';

import { dirksGraph } from './adjacency.js';

(function(){
  var world_width = 400,
      world_height = 400,
      controlbox_width = 300,
      controlbox_height = 300,
      n_grid_x = 24,
      n_grid_y = 24

//// Buttons and Blocks.
  var controls = d3.selectAll("#epidemics_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","epidemics_widgets")

  var g = widget.grid(controlbox_width,controlbox_height, n_grid_x, n_grid_y);
  var playblock = g.block({x0:5,y0:16,width:0,height:0});
  var buttonblock = g.block({x0:12,y0:14,width:4,height:0}).Nx(2);
  var sliderBlock = g.block({x0:2,y0:7,width:10,height:3});
  var sliderwidth = sliderBlock.w();
  var handleSize = 12, trackSize = 8;

  var playpause = { id:"b4", name:"run simulation",
                    actions: ["play","pause"], value: 0};

  var reset = { id:"sir_reset", name:"reset",
                actions: ["rewind"], value: 0};

  var buttons = [ widget.button(reset).update(runEpidemic) ]

  var playbutton = [
    widget.button(playpause).size(g.x(7))
          .symbolSize(0.6*g.x(7)).update(runpause),
  ]

  controls.selectAll(".button .others").data(buttons).enter()
    .append(widget.buttonElement).attr("transform",function(d,i) {
      return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});  

  controls.selectAll(".button .playbutton").data(playbutton).enter()
          .append(widget.buttonElement)
          .attr("transform", function(d,i){
     return "translate("+playblock.x(0)+","+playblock.y(i)+")"
   });

  var tm; // initialize timer
  function runpause(d){
    d.value == 1 ? tm = setInterval(runEpidemic, 500) : clearInterval(tm)
  }

  // Contagion Loop
  // var infected = [], susceptible = [], recovered = []
  // var graph = dirksGraph()
  // var namedV = genNamedVectors(graph, 50/100)
  // var [infected, susceptible] = Object.values(namedV)

  // Todo: DEAL WITH SCOPE HOW???
  // Color edges to show propagtion relations.
  // TODO: RE CLEAN DATA, SOME NOT LOWERCASE.
  function runEpidemic() {
    d3.json('js/json/adjacency.json', function(graph) {
      var infected = [], susceptible = [], recovered = []
      var namedV = genNamedVectors(graph, 50/100)
      var [infected, susceptible] = Object.values(namedV)

      var [infected, recovered] = updateRecovered(infected,recovered, 50/100)
      var [infected, susceptible] = updateSusceptible(graph, infected, susceptible, 50/100)

      var regex = RegExp(/^\d/)
      infected.forEach(function(name) {
        if (regex.test(name)) { name = '\\'+ name }
        let node = d3.select('#'+name)
        node.style('stroke', 'red')
      })

      // susceptible.forEach(function(name) {
      //   if (regex.test(name)) { name = '\\'+ name }
      //   let node = d3.select('#'+name)
      //   node.attr('fill', function(d) { return 'orange' }) 
      // })

      recovered.forEach(function(name) {
        if (regex.test(name)) { name = '\\'+ name }
        let node = d3.select('#'+name)
        node.attr('fill', 'black').style('stroke', 'white') 
      })
    })
  }

  // runEpidemic()

})()
