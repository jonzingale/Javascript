(function(){

  var world_width = 400,
      world_height = 400,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24,
      L = 150,
      k = world_width/L

  // moore neighborhood
  var moore = [[-1,-1],[-1, 0],[-1, 1],
              [ 0, -1],        [ 0, 1],
              [ 1, -1],[ 1, 0],[ 1, 1]]

  // create board
  var newboard = []
  var board = d3.range(L**2).map(function(d,i){
    return {
      x: i % L,
      y: Math.floor(i/L),
      state: Math.floor(Math.random() + 0.02) // sparse randomness
    }
  })

  var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  var Y = d3.scaleLinear().domain([0,L]).range([world_height,-3]);

  var world = d3.selectAll("#brians_brain_display")
    .append('canvas')
    .attr("width",world_width)
    .attr("height",world_height)
    .attr("class","explorable_display")

  var context = world.node().getContext('2d')

  var controls = d3.selectAll("#brians_brain_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","explorable_widgets") 

// Play button.
  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);
  var playblock = g.block({x0:5,y0:19,width:0,height:0});
  var playpause = { id:"b1", name:"", actions: ["play","pause"], value: 0};

  var playbutton = [
    widget.button(playpause).size(g.x(7))
          .symbolSize(0.6*g.x(7)).update(runpause)
  ]

  controls.selectAll(".button .playbutton").data(playbutton).enter()
    .append(widget.buttonElement)
    .attr("transform", function(d,i){
      return "translate("+playblock.x(0)+","+playblock.y(i)+")"
    });

  function runpause(d){ d.value == 1 ? t = d3.timer(runBlink,0) : t.stop(); }

  // Cellular Automata
  function modB(n) {
    return(n < 0 ? L + (n % L) : n % L)
  }

  function neigh(d) {
    var ns = moore.map(x =>
      board[modB(d.x + x[0]) + modB(d.y + x[1]) * L].state)

    // only sum if state is a 1
    result = ns.reduce((a,s) => a += s % 2, 0)
    return(result)
  }

  function conways(d) { // conway's blink
    if (d.state == 0 && neigh(c) == 3)
      { return {x: d.x, y: d.y, state: 1} }
    else if (d.state == 1 && (neigh(d) == 3 || neigh(d) == 2))
      { return {x: d.x, y: d.y, state: 1} }
    else { return {x: d.x, y: d.y, state: 0} }
  }

  // https://en.wikipedia.org/wiki/Brian%27s_Brain
  function brians(d) { // brian's blink
    if (d.state == 0 && neigh(d) == 2)
      { return {x: d.x, y: d.y, state: 1} }
    else if (d.state == 1)
      { return {x: d.x, y: d.y, state: 2} }
    else { return {x: d.x, y: d.y, state: 0} }
  }

  function updateDisplay() {
    board.forEach(function(d) {
      if (d.state == 0) { context.fillStyle = "black"}
      else if (d.state == 1) { context.fillStyle = "orange" }
      else { context.fillStyle = "red" }

      context.fillRect(X(d.x), Y(d.y),3.5,3.5);
    })
  }

  function runBlink() {
    newboard = board.map(x => brians(x))
    board = newboard
    updateDisplay()
  }
  
  runBlink() // loads board effectively
  
})()