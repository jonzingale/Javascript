(function(){

  var world_width = 400,
      world_height = 400,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24,
      L = 90

  // moore neighborhood
  var moore = [[-1,-1],[-1, 0],[-1, 1],
              [ 0, -1],        [ 0, 1],
              [ 1, -1],[ 1, 0],[ 1, 1]]

  // create board
  var newboard = []
  var board = d3.range(L**2).map(function(d,i){
    return {
      id: i,
      state: Math.floor(Math.random() + 0.02)
    }
  })

  var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  var Y = d3.scaleLinear().domain([0,L]).range([world_height,0]);

  var world = d3.selectAll("#brians_brain_display").append("svg")
    .attr("width",world_width)
    .attr("height",world_height)
    .attr("class","explorable_display")

  var cell = world.selectAll(".cell").data(board).enter().append("g")
    .attr("class","cell")

  cell.append("svg") // draws cells on board
    .append("rect").attr("x", 0).attr("y", 0)
    .attr("width", 7).attr("height", 7)
    .attr("transform",function(d){
      var x = d.id % L,
          y = Math.floor(d.id/L)  + 1.5
      return "translate("+X(x)+","+Y(y)+")rotate("+0+")"
    })

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

  function neigh(c) {
    var i = c.id % L,
        j = Math.floor(c.id/L)

    var ns = moore.map(x =>
      board[modB(i + x[0]) + modB(j + x[1]) * L].state)

    // only sum if state is a 1
    result = ns.reduce((a,d) => a += (d == 1 ? 1 : 0), 0)

    return(result)
  }

  function conways(c) { // conway's blink
    if (c.state == 0 && neigh(c) == 3)
      { return {id: c.id, state: 1} }
    else if (c.state == 1 && (neigh(c) == 3 || neigh(c) == 2))
      { return {id: c.id, state: 1} }
    else { return {id: c.id, state: 0} }
  }

  // https://en.wikipedia.org/wiki/Brian%27s_Brain
  function brians(c) { // brian's blink
    if (c.state == 0 && neigh(c) == 2)
      { return {id: c.id, state: 1} }
    else if (c.state == 1)
      { return {id: c.id, state: 2} }
    else { return {id: c.id, state: 0} }
  }

  function runBlink() {
    newboard = board.map(x => brians(x))
    board = newboard

    cell.data(board).attr("fill", function(d) {
        switch (d.state){
          case 0: return "#202020"
          case 1: return "orange"
          case 2: return "red"
          // case 0: return "lightgray" 
          // case 1: return "red"
          // case 2: return "orange"
        }
    })
  }

  runBlink() // loads board effectively

})()