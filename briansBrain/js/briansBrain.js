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

  var world = d3.selectAll("#automata_display").append('canvas')
                .attr('width', world_width)
                .attr('height', world_height)
                .attr("class",'automata_display')

  var context = world.node().getContext('2d')

  var controls = d3.selectAll("#automata_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","automata_widgets")

  // Play button.
  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);
  var playblock = g.block({x0:5,y0:19,width:0,height:0});
  var buttonblock = g.block({x0:3,y0:10,width:4,height:0}).Nx(2);
  var ruleblock = g.block({x0:8,y0:10,width:6,height:3}).Ny(2);

  var playpause = { id:"b4", name:"start world", actions: ["play","pause"], value: 0};
  var reset = { id:"b6", name:"new world", actions: ["rewind"], value: 0};
  var rule = {id:"t1", name: "Conway's / Brian's",  value: true};

  var playbutton = [
   widget.button(playpause).size(g.x(7))
         .symbolSize(0.6*g.x(7)).update(runpause)
  ]

  var buttons = [
    widget.button(reset).update(resetpositions),
  ]

  var toggles = [
    widget.toggle(rule).label("bottom").size(14).update(togglerule),
  ]

  controls.selectAll(".button .playbutton").data(playbutton).enter()
          .append(widget.buttonElement)
          .attr("transform", function(d,i){
     return "translate("+playblock.x(0)+","+playblock.y(i)+")"
   });

  controls.selectAll(".button .others").data(buttons).enter()
          .append(widget.buttonElement)
          .attr("transform",function(d,i){
     return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"
   });  

  controls.selectAll(".toggle").data(toggles).enter()
          .append(widget.toggleElement)
          .attr("transform",function(d,i){
      return "translate("+ruleblock.x(0)+","+ruleblock.y(i)+")"
  });  

  var t; // initialize timer
  function runpause(d){ d.value == 1 ? t = d3.timer(runBlink,0) : t.stop(); }

  function resetpositions() {
    if (typeof(t) === "object") {t.stop()};
    board.forEach( d => d.state = Math.floor(Math.random() + 0.02))
    runBlink()
  }

  function togglerule(d) {
    d.value ? rule.value = true : rule.value = false
  }

  // Cellular Automata
  function modB(n) {
    return(n < 0 ? L + (n % L) : n % L)
  }

  function neigh(d) {
    var ns = moore.map(x =>
      board[modB(d.x + x[0]) + modB(d.y + x[1]) * L].state)

    // only sum if state is a 1
    var result = ns.reduce((a,s) => a += s % 2, 0)
    return(result)
  }

  function conways(d) { // conway's blink
    if (d.state == 0 && neigh(d) == 3)
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

      context.fillRect(X(d.x), Y(d.y), 3.5, 3.5);
    })
  }

  function runBlink() {
    newboard = board.map(x => rule.value ? brians(x) : conways(x))
    board = newboard
    updateDisplay()
  }
  
  runBlink() // loads board effectively
  
})()