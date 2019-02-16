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


// Nagel-Schreckenberg Algorithm:
// * accelerate by 1 unit if not max: 5
// * slowing down to p(b)-p(a)-1 if v(a) > p(b)-p(a)
// * with likelihood p, reduce speed 1 unit
// * update positions

  function mod(a,b){return(((a % b) + b) % b)}

  // chooses n, an ordered but random subset of p.
  function randPositions(p, n) {
    var rPositions = []
    var zeroToP = []
    var r = 0

    // gives the total possible car positions
    while (p>=0) { zeroToP.unshift(p) ; p-=1}

    // iteratively choose n possible positions
    while (n > 0) {
      r = Math.floor(Math.random() * zeroToP.length)
      rPositions.unshift(zeroToP[r])
      zeroToP = zeroToP.filter(p => p != zeroToP[r])
      n -= 1
    }

    rPositions.sort(function(a, b){return a-b})
    return rPositions
  }

  var maxV = 5
  // available positions -> # cars -> Traffic
  function randTraffic(p, n) {
    var pps = randPositions(p, n)
    var rando = 0
    var cars = []
    var vvs = []

    while (p>=0) {
      rando = Math.floor(Math.random() * maxV)
      vvs.unshift(rando)
      p-=1
    }

    while (n > 0) {
      p = pps.shift()
      v = vvs.shift()
      cars.push({'id': n, 'pos': p, 'vel': v})
      n -= 1
    }
    return cars
  }

  var trSize = 20
  var traffic = randTraffic(trSize, 5)

  // distances :: Traffic -> [Int]
  function distances(tff) {
    var poss = tff.map(c => c.pos)
    var t = tff.shift() ; tff.push(t)

    var ds = poss.map(function(e,i) {
      return(mod(tff[i].pos - e, trSize))
    })
    return ds
  }

  // Todo: don't redefine traffic in function
  function updateVs(tff) {
    var dds = distances(tff)
    var cars = []
    while (tff.length > 0){
      d = dds.shift()
      t = tff.shift()

      if (d > maxV && t.vel < maxV) { t.vel += 1 } 
      else if (t.vel >= d) { t.vel = d-1 }
      cars.unshift(t)
    }
    return(traffic=cars)
  }

  // Todo: don't redefine traffic in function
  function updatePs(tff) {
    var cars = tff.map(function(car){
      var p = car.pos
      var v = car.vel
      return {'id': 1, 'pos': mod(p+v, trSize), 'vel': v}
    })
    return(traffic=cars)
  }
// roadJitters :: StdGen -> Traffic -> (Traffic, StdGen)
// roadJitters g cs =
//   let (bs, g') = biasedCoins g prob in -- use of global
//   let zeroV v b = if v > braking-1 then v-(b*braking) else v in
//   let tf = [Car i p (zeroV v b) | (Car i p v, b) <- zip cs bs] in
//     (tf, g')


// runNS :: StdGen -> Traffic -> IO()
// runNS g cs = do
//   let uVCs = updateVs cs
//   let (uJCs, g') = roadJitters g uVCs
//   let uPCs = updatePs uJCs
//   putStr $ showTraffic cs
//   wait (10^6)
//   runNS g' uPCs
// ary = [] ; p = 10 ; while (p>=0) { ary.unshift(p) ; p-=1}
console.log(JSON.stringify(updatePs(traffic)))
console.log(JSON.stringify(updatePs(traffic)))


//////////////////////////////////


  function updateDisplay() {
    board.forEach(function(d) {
      if (d.state == 0) { context.fillStyle = "black"}
      else if (d.state == 1) { context.fillStyle = "orange" }
      else { context.fillStyle = "red" }

      context.fillRect(X(d.x), Y(d.y), 3.5, 3.5);
    })
  }

  function runBlink() {
    // newboard = board.map(x => rule.value ? brians(x) : conways(x))
    board = newboard
    updateDisplay()
  }
  
  runBlink() // loads board effectively
  
})()