(function(){

  // var widget = new widgetModule(); // instantiate widget

  // The goal here is to explore the collatz
  // conjecture via the cobweb method and Ulam's napkin.

  // perhaps rewrite as d3 elems rather than canvas
  // benefit would be clearer lines.

  // fixed parameters
  // var L = 10**8 // world size for cobweb
  var L = 300 // world size for ulams napkin

  var ctxSize = 600,
      center = ctxSize / 2,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24;

  var world = d3.selectAll("#collatz_display").select("canvas")
  var context = world.node().getContext('2d')

  // background color
  context.fillStyle = "black"
  context.fillRect(0,0, ctxSize, ctxSize)

  var controls = d3.selectAll("#collatz_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","collatz_widgets")

  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);

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
  var X = d3.scaleLinear().domain([0,L]).range([0,ctxSize]);
  var Y = d3.scaleLinear().domain([0,L]).range([ctxSize,0]);

  function randCVal() { return (Math.floor(Math.random() * 255)) }

  var point = {} ;
  function setPoint() {
    color = "rgb(" + randCVal() + "," + randCVal() + "," + randCVal() + ")"
    // x = 1 + Math.floor(Math.random() * Math.floor(L/20000))
    x = 1 + Math.floor(Math.random() * Math.floor(L)) // 1 so as not to 0.
    fx = collatz(x)
    point = {name: x, a: x, b: fx, c: fx, d: fx, color: color}
  }

  // timer variable for the simulation
  var t;

  // functions for the action buttons
  function runpause(d){ d.value == 1 ? t = d3.timer(runCobweb,0) : t.stop(); }

  function resetpositions(){
    clearCanvas()
    if (typeof(t) === "object") {t.stop()};
  }

  function collatz(x) {
    if (x % 2 == 0) { return (x/2) }
      else { return(x * 3 + 1) }
  }

  function  nToUlam(n) {
    var jth = Math.ceil((n**0.5 - 1)/2) // jth concentric square
    var k = jth * 8
    var i = ((n - 8) % k) - 2
    var x = jth * Math.cos(2*Math.PI*i/k)
    var y = jth * Math.sin(2*Math.PI*i/k)
    return([x,y])
  }

  function ulamsNapkin(pairs) {
    // for (j = 0; j < 20; j++) {
    //   for (i = 0; i < j*8; i++) {
    //     var x = (i/10) * (Math.cos(2*Math.PI*(i-j+1)/(j*8)))
    //     var y = (i/10) * (Math.sin(2*Math.PI*(i-j+1)/(j*8)))
    //     pairs.push([x,y])
    //   }
    // }
    for (j = 0; j < 20; j++) {
      for (i = 0; i < j*8; i++) {
        var x = j * (Math.cos(2*Math.PI*(i-j+1)/(j*8)))
        var y = j * (Math.sin(2*Math.PI*(i-j+1)/(j*8)))
        pairs.push([x,y])
      }
    }
  }

  function rescale(val){
    return (12*val + center)
    // return (38*val + center)
  }

  var pairs = [[0,0]]
  ulamsNapkin(pairs)

  function displayNapkin() {
    // write numbers
    context.lineWidth = 0.3
    // context.strokeStyle = 'rgb(0,0,0,0)'
    context.strokeStyle = 'rgb(100,100,100)'
    context.fillStyle = 'white'
    context.font="15px Georgia"
    context.beginPath()

    for (i=0; i < pairs.length - 1; i++){
      // context.fillText(i+1,rescale(pairs[i][0]),rescale(pairs[i][1])); display nums
      context.moveTo(rescale(pairs[i][0]), rescale(pairs[i][1]));
      context.lineTo(rescale(pairs[i+1][0]), rescale(pairs[i+1][1]))
      context.stroke();
    }
  }

  function displayUlams() {
    var a = point.a,
        c = point.c

    point.a = point.c
    point.b = point.d
    point.c = collatz(a)
    point.d = collatz(c)

    var [x1,y1] = nToUlam(point.a)
    var [x2,y2] = nToUlam(point.c)

    context.strokeStyle = point.color
    context.beginPath();
    context.moveTo(rescale(x1),rescale(y1));
    context.lineTo(rescale(x2),rescale(y2));
    context.stroke();
    if (point.a == 1) {setPoint()}
  }

  function runCobweb() {
    fadeCanvas()
    // displayCobweb()
    displayUlams()
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

  function fadeCanvas() {
    // overlay fade
    context.fillStyle = "rgb(0,0,0,0.05)" // black
    // context.fillStyle = "rgb(200,200,200,0.05)" // grey
    context.fillRect(0,0, ctxSize, ctxSize)

    // display N
    context.fillStyle = "rgb(0,0,0,1)"
    context.fillRect(ctxSize-100,0, ctxSize, 60)
    context.fillStyle = 'white'
    context.font="40px Georgia"
    context.fillText(point.name,ctxSize-100,30);

    // orange diagonal
    // context.lineWidth = 1
    // context.strokeStyle = "orange"
    // context.beginPath();
    // context.moveTo(0,0);
    // context.lineTo(ctxSize, ctxSize);
    // context.stroke();

    // napkin
    // displayNapkin()

    // restore line width
    context.lineWidth = 3
  }

  function clearCanvas() {
    context.fillStyle = "rgb(0,0,0,1)"
    context.fillRect(0,0, ctxSize, ctxSize)
    // context.strokeStyle = "orange"
    // context.beginPath();
    // context.moveTo(0,0);
    // context.lineTo(ctxSize, ctxSize);
    // context.stroke();
    displayNapkin()
  }

  clearCanvas()
  setPoint()
})()