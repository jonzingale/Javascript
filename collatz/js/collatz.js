(function(){

  // var widget = new widgetModule(); // instantiate widget

  // The goal here is to explore the collatz
  // conjecture via the cobweb method.

  // perhaps rewrite as d3 elems rather than canvas
  // benefit would be clearer lines.

  var world_width = 600,
      world_height = 600,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24;

  var world = d3.selectAll("#collatz_display").select("canvas")
  var context = world.node().getContext('2d')

  // background color
  context.fillStyle = "black"
  context.fillRect(0,0, world_width, world_height)

  var controls = d3.selectAll("#collatz_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","collatz_widgets")

  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);

  // fixed parameters
  var N = 10**3, // # of points
      L = 10**3 // world size

  var playblock = g.block({x0:20,y0:19,width:0,height:0});
  var buttonblock = g.block({x0:13,y0:18,width:4,height:0}).Nx(2);

  // important to have unique id names because Widget is shared
  var playpause = { id:"collatzplay", name:"", actions: ["play","pause"], value: 0};
  var back = { id:"collatzback", name:"", actions: ["back"], value: 0};

  var playbutton = [
    widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause)
  ]

  var buttons = [
    widget.button(back).update(resetpositions),
  ]

  // Buttons
  controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+playblock.x(0)+","+playblock.y(i)+")"});  

  controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});  

  // position scales
  var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  var Y = d3.scaleLinear().domain([0,L]).range([world_height,0]);

  function randCVal() { return (Math.floor(Math.random() * 255)) }

  var points = d3.range(N).map(function(d,i) {
    x = Math.floor(Math.random() * L)
    fx = collatz(x)
    return {
      a: x, b: fx, c: fx, d: fx,
      color: "rgb(" + randCVal() + "," + randCVal() + "," + randCVal() + ")"
    }
  })

  // timer variable for the simulation
  var t;

  // functions for the action buttons
  function runpause(d){ d.value == 1 ? t = d3.timer(runCobweb,0) : t.stop(); }

  function resetpositions(){
    clearCanvas()
    if (typeof(t) === "object") {t.stop()};
    points.forEach(function(v){
      x = Math.floor(Math.random() * L)
      fx = collatz(x)
      v.a = x
      v.b = fx
      v.c = fx
      v.d = fx
    })
  }

  function resetparameters(){
  }

  function collatz(x) {
    if (x % 2 == 0) { return (x/2) } else { return(x * 3 + 1) }
  }

  function runCobweb() {
    fadeCanvas()
    updateDisplay()
  }

  function fadeCanvas() {
    context.fillStyle = "rgb(0,0,0,0.01)"
    context.fillRect(0,0, world_width, world_height)
  }

  function clearCanvas() {
    context.fillStyle = "rgb(0,0,0,1)"
    context.fillRect(0,0, world_width, world_height)
    context.strokeStyle = "orange"
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(L,L);
    context.stroke();
  }

  function updateDisplay() {
    points.forEach(function(v) {
      var a = v.a, c = v.c

      v.a = v.c
      v.b = v.d
      v.c = collatz(a)
      v.d = collatz(c)

      context.strokeStyle = v.color
      context.beginPath();
      context.moveTo(v.a, v.b);
      context.lineTo(v.c, v.d);
      context.stroke();
    })
  }
  clearCanvas()
})()