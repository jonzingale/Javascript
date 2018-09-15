(function(){

  var cellSize = 4, // better would be squares i think
      Board = 60,
      L = 61

  var world_width = 400,
      world_height = 400,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24;

  // moore neighborhood
  var moore = [[-1,-1],[-1, 0],[-1, 1],
              [ 0, -1],        [ 0, 1],
              [ 1, -1],[ 1, 0],[ 1, 1]]

  // create board
  var board = d3.range(Board**2).map(function(d,i){
    return {
      id: i,
      x: i % Board,
      y: Math.floor(i/Board),
      state: Math.floor(Math.random() + 0.3)
      // good for brians, 70% for conways?
    }
  })

  var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  var Y = d3.scaleLinear().domain([0,L]).range([world_height,0]);

  var world = d3.selectAll("#brians_brain_display").append("svg")
    .attr("width",world_width)
    .attr("height",world_height)
    .attr("class","explorable_display")
    
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

  controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+playblock.x(0)+","+playblock.y(i)+")"});  

  function runpause(d){ d.value == 1 ? t = d3.timer(runBlink,0) : t.stop(); }

/////////////////

  cell = world.selectAll(".cell").data(board).enter().append("g")
    .attr("class","cell")
    .attr("transform",function(d){
      return "translate("+X(d.x + 1)+","+Y(d.y + 1)+")rotate("+0+")"
    })

  // elaborate board
  cell.append("path")
    .attr("class","drop")
    .attr("d",celldata)
    .style("opacity",0)
    .transition().duration(1000)
    .style("opacity",1)

  function celldata() {
    var M = 30;
    var line = d3.line()
                 .x(function(d) { return cellSize*d.x; })
                 .y(function(d) { return cellSize*d.y; })

    var drop = d3.range(M).map(function(d,i){
        return {
          x: Math.cos(i/M*Math.PI*2),
          y: Math.sin(i/M*Math.PI*2)
        };
      })
    return line(drop);
  } 

  function modB(n) {
    return(n < 0 ? Board + (n % Board) : n % Board)
  } 

  function neigh(c) {
    var i = c.id % Board,
        j = Math.floor(c.id/Board)

    var ns = moore.map(x =>
      board[modB(i+x[0]) + modB(j+x[1]) * Board].state)

    console.log(ns)

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
    var newboard = []
    board.forEach(function(c){
      newboard[c.id] = brians(c)
    })

    cell.data(newboard).attr("fill", function(d) {
        switch (d.state){
          case 0: return "black" 
          case 1: return "red"
          case 2: return "orange"
          // case 0: return "lightgray" 
          // case 1: return "red"
          // case 2: return "orange"
        }
    })

    board = newboard
  }

})()