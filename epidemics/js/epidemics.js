// SERVER on 8000: python -m http.server
import {} from './algebraicGraph.js';

const generateGraph = [] // place-holder

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

  var buttons = [ widget.button(reset).update(generateGraph) ]

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

  var t; // initialize timer
  function runpause(d){ d.value == 1 ?
    t = d3.timer(runBlink,0) : t.stop(); }

  // var roadContainer = d3.selectAll("#network").append("svg")
  //   .attr("width",world_width)
  //   .attr("height",world_height)
  //   .attr("class","network")

  // d3.json("js/json/gitGraph.json", function(error, graph) {
  //   if (error) throw error;
  // })

  function updateDisplay(coords) {
    var cData = coords.map(function([x,y]){
      return { 'cx' : x + 30, 'cy' : y + 30 }
    })

    roadCars.data(cData)
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
  }

  function runEpidemic() {
    // <M*i| s>
    // new M, i , s
    // 
  }

  // const traffic = generateGraph()

  function runBlink() {
    // updateDisplay(traffic)
  }

  runBlink()

})()
