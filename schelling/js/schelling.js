// http://nifty.stanford.edu/2014/mccown-schelling-model-segregation/
(function(){

  var L = 50,
      world_width = 400,
      agentSize = world_width/L,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24,
      tolerance = 4.3, // how tolerant are the agents?
      sparsity = 1, // how much room is there to spread out?
      occupiedBoard,
      population,
      freeBoard

  // moore neighborhood
  var moore = [[ 1, -1],[ 1, 0],[ 1, 1],
               [ 0, -1],        [ 0, 1],
               [-1, -1],[-1, 0],[-1, 1]]

  // runpause({value: 1})
  function createBoard(){
    freeBoard = {}
    occupiedBoard = {}
    var stateK = 5/22 * (1 + spar.value**1.6)
    d3.range(L**2).forEach(function(d,i){
      var id = String(i),
          x = i % L,
          y = Math.floor(i/L),
          state = Math.floor(Math.random()+ stateK),
          ptype = Math.floor(Math.random() + 0.5)

      if (state == 0) {
        freeBoard[id] = {x: x, y: y, c: 'black'}
      }
      else if (state == 1 && ptype == 1) {
        occupiedBoard[id] = {x: x, y: y, c: 'orange'}
      }
      else {
        occupiedBoard[id] = {x: x, y: y, c: 'red'}
      }
      population = Object.keys(occupiedBoard).length
    })
  }

  var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  var Y = d3.scaleLinear().domain([0,L]).range([world_width,0]);

  var world = d3.selectAll("#schelling_display").append('canvas')
    .attr('width', world_width)
    .attr('height', world_width)
    .attr("class",'schelling_display')

  var context = world.node().getContext('2d')
  context.fillRect(0, 0, world_width, world_width);

  var controls = d3.selectAll("#schelling_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","schelling_widgets")

  var happiness = d3.select('#percentHappy')
        .append('text')
        .attr("x",100)
        .attr("y",100)
        .text("ther")

  // Buttons and Blocks.
  var g = widget.grid(controlbox_width,controlbox_height,
                      n_grid_x, n_grid_y);
  var playblock = g.block({x0:6,y0:19,width:0,height:0});
  var buttonblock = g.block({x0:12,y0:19,width:4,height:0});
  var radioBlock = g.block({x0:15,y0:10,width:0,height:0});
  var sliderBlock = g.block({x0:2,y0:5,width:10,height:3});

  var sliderwidth = sliderBlock.w();
  var handleSize = 12, trackSize = 8;

  var playpause = { id:"b4", name:"run simulation",
                    actions: ["play","pause"], value: 0};

  var tol = {id:"tol", name: "satisfied <-------|-------> seeking",
             range: [2,6], value: tolerance};

  var spar = {id:"sparsity", name: "Sparsity",
             value: sparsity, choices: ['sparse','between','dense']};

  var radios = [
    widget.radio(spar).buttonSize(40).update(createBoard),
  ]

  var sliders = [
    widget.slider(tol).width(sliderwidth).trackSize(trackSize)
      .handleSize(handleSize),
  ]

  var playbutton = [
   widget.button(playpause).size(g.x(7))
         .symbolSize(0.6*g.x(7)).update(runpause)
  ]

  controls.selectAll(".radio .block2").data(radios).enter()
    .append(widget.radioElement).attr("transform",function(d,i){
      return "translate("+radioBlock.x(0)+","+radioBlock.y(i)+")"
    });

  controls.selectAll(".slider .block3").data(sliders).enter().append(widget.sliderElement)
    .attr("transform",function(d,i){
      return "translate("+sliderBlock.x(0)+","+sliderBlock.y(i)+")"
    }); 

  controls.selectAll(".button .playbutton").data(playbutton).enter()
          .append(widget.buttonElement)
          .attr("transform", function(d,i){
     return "translate("+playblock.x(0)+","+playblock.y(i)+")"
   });

  var t; // initialize timer
  function runpause(d){ d.value == 1 ? t = d3.timer(schelling,0) : t.stop(); }

  // Schelling Segration Code
  // TODO: write nearest avail so that first nearest is sufficient
  // consider a ball about the given agent.
  function nearestAvail(a){
    var dist; var rental;
    Object.keys(freeBoard).reduce(function(e, k){
      var fa = freeBoard[k]
      fa['id'] = k
      dist = Math.sqrt((fa.x - a.x)**2 + (fa.y - a.y)**2)
      if (dist < e) { rental = fa ; return(dist) } else { return(e) }
    }, Infinity)
    return rental
  }

  function modB(n) {
    return(n < 0 ? L + (n % L) : n % L)
  }

  function neigh(a) {
    return(
      moore.reduce(function(acc, m) {
        var nkey = modB(a.x + m[0]) + modB(a.y + m[1]) * L
        var cond = !!(occupiedBoard[nkey]) && (occupiedBoard[nkey].c == a.c)
        if (cond) { return (acc += 1) } else { return acc }
      }, 0)
    )
  }

  function schelling() {
    var satisfied = 0
    Object.keys(occupiedBoard).forEach(function(key){
      var agent = occupiedBoard[key]
      if (neigh(agent) < tol.value) {
        // calculate distance from agent to nearest available rental
        newRental = nearestAvail(agent)
        newRental['c'] = agent.c

        // remove occupants and make available as rental
        delete occupiedBoard[key]
        freeBoard[key] = agent
        context.fillStyle = "black"
        context.fillRect(X(agent.x), Y(agent.y), agentSize, agentSize);

        // move into new rental and remove rental from market
        delete freeBoard[newRental.id]
        occupiedBoard[newRental.id] = newRental
        context.fillStyle = agent.c
        context.fillRect(X(newRental.x), Y(newRental.y), agentSize, agentSize);
      } else { satisfied += 1 }
    })

    displayHappiness(satisfied)
  }

  function displayHappiness(s) { // make this a simple dom element update
    percentSatisfied = Math.floor(100 * s / population)
    happiness.text("Happiness: "+percentSatisfied+" %")
  }

  // loads Initial conditions
  createBoard()
  schelling()
})()