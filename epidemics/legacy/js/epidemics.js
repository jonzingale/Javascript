// import miserable from miserable.js;

(function(){

  var world_width = 400,
      world_height = 400,
      controlbox_width = 300,
      controlbox_height = 300,
      n_grid_x = 24,
      n_grid_y = 24

  const numNodes = 10
  const boardSize = 300

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

  var reset = { id:"schellingreset", name:"reset",
                actions: ["rewind"], value: 0};

  var buttons = [ widget.button(reset).update(generateCoordinates) ]

  var playbutton = [
    widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause),
  ]

  controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});  

  controls.selectAll(".button .playbutton").data(playbutton).enter()
          .append(widget.buttonElement)
          .attr("transform", function(d,i){
     return "translate("+playblock.x(0)+","+playblock.y(i)+")"
   });

  var t; // initialize timer
  function runpause(d){ d.value == 1 ?
    t = d3.timer(runBlink,0) : t.stop(); }

  var roadContainer = d3.selectAll("#open_road").append("svg")
    .attr("width",world_width)
    .attr("height",world_height)
    .attr("class","open_road")

  var carData = [] // data for Cars on Road.
  var colors = ['red', 'orange', 'green', 'blue', 'violet']

  colors.forEach(function(c) {
    carData.unshift({ 'cx': 340, 'cy' : 175, 'r' : 9, 'color': c })
  })

  var roadCars = roadContainer.selectAll('circle')
    .data(carData).enter().append('circle')

  roadCars.style("fill", function (d) { return d.color; })
    .attr("cx", function (d) { return d.cx; })
    .attr("cy", function (d) { return d.cy; })
    .attr("r" , function (d) { return d.r; })

  function mod(a,b){return(((a % b) + b) % b)}

  function generateCoordinates() {
    nodes = [] ; for (let i=0; i < numNodes; i++) {
      var x = Math.floor(Math.random()*boardSize)
      var y = Math.floor(Math.random()*boardSize)
      nodes.push([x,y])
    } ; return nodes
  }

  // vector constants
  var vect = [1,2,3]
  var wect = [4,5,6]
  var matr = [[1,2,3],[4,5,6],[7,8,9]]
  var xect = vectorTransform(matr, vect)
  var ns = innerProduct(xect, wect)

  // Vector -> Vector -> Vector
  function innerProduct(v, w) {
    return v.map((e, i) => e*w[i])
  }

  // Matrix -> Vector -> Vector
  function vectorTransform(m, v) {
    var w = m.map(function(e) {
      return innerProduct(e, v).reduce((t, v) => t + v)
    }) ; return w
  }

  // Vector -> N -> Vector
  function nubList(list, i) { var ls = [];
    list.forEach(function(l, j) { if (j!=i) { ls.push(l) }})
    return ls
  }

  // Matrix -> N -> Matrix
  function removeNode(matrx, i) { var mm = [];
    matrx.forEach(function(rs, j) {
      if (j!=i) { mm.push(nubList(rs, i)) }
    }) ; return mm
  }

  function updateDisplay(coords) {
    var cData = coords.map(function([x,y]){
      return { 'cx' : x + 30, 'cy' : y + 30 }
    })

    // miserable

    roadCars.data(cData)
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
  }

  traffic = generateCoordinates()

  function runBlink() {
    updateDisplay(traffic)
  }

  runBlink()

})()