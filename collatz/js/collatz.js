(function(){

  // var widget = new widgetModule(); // instantiate widget

  // The goal here is to explore the collatz
  // conjecture via the cobweb method and Ulam's napkin.

  // perhaps rewrite as d3 elems rather than canvas
  // benefit would be clearer lines.

  var world_width = 600,
      world_height = 600,
      center = world_width / 2,
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

  var point = {} ;
  function setPoint() {
    color = "rgb(" + randCVal() + "," + randCVal() + "," + randCVal() + ")"
    x = Math.floor(Math.random() * L)
    fx = collatz(x)
    point = {name: x, a: x, b: fx, c: fx, d: fx, color: color}
  }

  setPoint()
  console.log(point)

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

  function traceNapkin(n) {
    var j = Math.floor(n%8)
    var i = n % j
    // var j = 0
    // for (j = 0; j < 8; j ++) {
      // for (i = 0; i < k; i++) { 
        var x = j * (Math.cos(2*Math.PI*(i-j+1)/(j*8)))
        var y = j * (Math.sin(2*Math.PI*(i-j+1)/(j*8)))
        // return([x,y])

        // console.log([x,y])
        // pairs.push([x,y])
      // }
    // }
  }

  for (j=0; j < 10; j++){
    traceNapkin(j)
  }

  function ulamsNapkin(pairs) {
    var j = 0
    for (j = 0; j < 8; j ++) {
      for (i = 0; i < j*8; i++) {
        var x = j * (Math.cos(2*Math.PI*(i-j+1)/(j*8)))
        var y = j * (Math.sin(2*Math.PI*(i-j+1)/(j*8)))
        pairs.push([x,y])
      }
    }
  }

  function rescale(val){
    return (38*val + center)
  }

  function displayNapkin() {
    var pairs = [[0,0]]
    ulamsNapkin(pairs)
    context.strokeStyle = 'white'
    context.fillStyle = 'white'
    context.font="15px Georgia"
    context.beginPath()
    for (i=0; i < pairs.length - 1; i++){
      context.fillText(i+1,rescale(pairs[i][0]),rescale(pairs[i][1]));
      context.moveTo(rescale(pairs[i][0]), rescale(pairs[i][1]));
      context.lineTo(rescale(pairs[i+1][0]), rescale(pairs[i+1][1]))
      context.stroke();
    }
  }

  function collatz(x) {
    if (x % 2 == 0) { return (x/2) }
      else { return(x * 3 + 1) }
  }

  function runCobweb() {
    fadeCanvas()
    displayCobweb()
  }

  function fadeCanvas() {
    context.fillStyle = "rgb(0,0,0,0.1)"
    context.fillRect(0,0, world_width, world_height)
    // display N
    context.fillStyle = 'white'
    context.font="40px Georgia"
    context.fillText(point.name,world_width-100,30);

    // orange diagonal
    context.lineWidth = 1
    context.strokeStyle = "orange"
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(L,L);
    context.stroke();
    context.lineWidth = 3
  }

  function clearCanvas() {
    context.fillStyle = "rgb(0,0,0,1)"
    context.fillRect(0,0, world_width, world_height)
    context.strokeStyle = "orange"
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(L,L);
    context.stroke();
    displayNapkin()
  }

  function displayCobweb() {
      var a = point.a,
          c = point.c

      point.a = point.c
      point.b = point.d
      point.c = collatz(a)
      point.d = collatz(c)

      context.strokeStyle = point.color
      context.beginPath();
      context.moveTo(point.a, point.b);
      context.lineTo(point.c, point.d);
      context.stroke();

      if (point.a == 1) {setPoint()}
  }
  clearCanvas()
})()