(function(){

  var world_width = 400,
      world_height = 400,
      controlbox_width = 350,
      controlbox_height = 350,
      n_grid_x = 24,
      n_grid_y = 24

  var world = d3.selectAll("#dragonMaps_display").append('canvas')
    .attr('width', world_width)
    .attr('height', world_height)
    .attr("class",'dragonMaps_display')

  var context = world.node().getContext('2d')

  var controls = d3.selectAll("#dragonMaps_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","dragonMaps_widgets")

  // Play button.
  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);
  var playblock = g.block({x0:5,y0:19,width:0,height:0});
  var buttonblock = g.block({x0:5,y0:11,width:4,height:0}).Nx(2);
  var paramsblock = g.block({x0:12,y0:10,width:10,height:8}).Ny(3);

  var playpause = { id:"b4", name:"play / pause",
                    actions: ["play","pause"], value: 0};

  var reset = { id:"b6", name:"reset", actions: ["rewind"], value: 0};

  var playbutton = [
   widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause)
  ]

  var buttons = [
    widget.button(reset).update(resetpositions),
  ]

  // Constants
  var maxV = 5
  var braking = 1
  var prob = 1/3

  var carSize = 2
  var trSize = world_width
  var numCars = Math.floor(35/100*world_width/carSize)

  // Sliders
  var def_velocity_param = 5, // Max Velocity
      def_braking_param = 1, // sensitivity when braking
      def_prob_param = 1/3 // probability of braking

  var sliderwidth = paramsblock.w();
  var handleSize = 12, trackSize = 8;

  var maxV = {id:"maxV", name: "max velocity", range: [1,20], value: def_velocity_param};
  var braking = {id:"braking", name: "brake sensitivity", range: [1,10], value: def_braking_param};
  var prob = {id:"prob", name: "probability of braking", range: [0,1], value: def_prob_param};

  var sliders = [
    widget.slider(prob).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(braking).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(maxV).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
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

  controls.selectAll(".slider .block3").data(sliders).enter().append(widget.sliderElement)
    .attr("transform",function(d,i){return "translate("+paramsblock.x(0)+","+paramsblock.y(i)+")"});  


  var tm; // initialize timer
  function runpause(d){
    d.value == 1 ? tm = setInterval(runBlink, 50) : clearInterval(tm)
  }

  function resetpositions() {
    if (typeof(t) === "object") {clearInterval(tm)};
    context.fillStyle = 'white'
    context.fillRect(0, 0, world_width, world_height);
    var dragonMaps = randTraffic(trSize, numCars)
    runBlink()

    sliders[0].click(def_probability_param);
    sliders[1].click(def_braking_param);
    sliders[2].click(def_velocity_param);
  }

  // Dragon Maps:
  scalar = 10
  boardSize = world_width/scalar * world_height/scalar

  function genBoard() {
    var accum = []
    for (let i=0; i < boardSize; i++) {
      accum.unshift(Math.floor(Math.random()*90))
    }
    return accum
  }

  // neighborhood

  // averaging scheme.

  // averages neighborhoods over board


  function boardToPoints(board) {
    var hotSpots = []

    for (let i=0; i < 5; i++) {
      hotSpots.unshift(Math.floor(Math.random()*boardSize))
    }

    board.forEach((c, i) => {
      var x = i % (world_width/scalar)
      var y = Math.floor(i / (world_height/scalar))

      if (hotSpots.indexOf(i) > -1) {
        context.fillStyle = `hsl(30,100%,50%)`
      } else { context.fillStyle = `hsl(250,${c}%,50%)` }

      context.fillRect(x*scalar, y*scalar, 10, 10);
    })

  }

  var board = genBoard()
  boardToPoints(board)

  // console.log(JSON.stringify(genBoard()))

  // function mod(a,b){return(((a % b) + b) % b)}

  // // chooses n, an ordered but random subset of p.
  // function randPositions(p, n) {
  //   var [rPositions, zeroToP] = [[],[]]

  //   // gives the total possible car positions
  //   for (i=0; i < p; i++) { zeroToP.unshift(i) }

  //   // iteratively choose n possible positions
  //   for (i=0; i < n; i++ ) {
  //     var r = Math.floor(Math.random() * zeroToP.length)
  //     rPositions.unshift(zeroToP[r])
  //     zeroToP = zeroToP.filter(p => p != zeroToP[r])
  //   }

  //   rPositions.sort(function(a, b){return b-a})
  //   return rPositions
  // }

  // // available positions -> # cars -> Traffic
  // function randTraffic(p, n) {
  //   var mV = Math.floor(maxV.value) || 5
  //   var pps = randPositions(p, n)
  //   var [cars, vvs] = [[],[]]
  //   var rando = 0

  //   for (i=0; i < p; i++) {
  //     vvs.push(1+Math.floor(Math.random() * (mV-1)))
  //   }

  //   for (i=0; i < n; i++) {
  //     [p, v] = [pps.shift(), vvs.shift()]
  //     col = 'black' ; if (i==0) {col = 'red'} 
  //     cars.unshift({'cid': n-i-1, 'pos': p, 'vel': v, 'col': col})
  //   }
  //   return cars
  // }

  // function updateVs(tff) {
  //   var cff = []

  //   tff.forEach(function(car) {
  //     var b = 0 ; if (Math.random() < prob.value) {b = 1}
  //     var prevCar = tff[mod(car.cid - 1, numCars)]
  //     var nextCar = tff[mod(car.cid + 1, numCars)]
  //     var dn = mod(nextCar.pos - car.pos, trSize)
  //     var dp = mod(car.pos - prevCar.pos, trSize)
  //     var br = Math.floor(braking.value) || 1
  //     var mV = Math.floor(maxV.value) || 5
  //     var vel = car.vel

  //     // update velocity
  //     if (dn > mV && mV > car.vel) { vel = car.vel + 1 } // go max speed
  //     else if (car.vel > dn) { vel = dn } // too fast, slow down
  //     else { vel = car.vel } // just right

  //     // jitters
  //     if (vel > br) { vel -= b*Math.min(br, dp) }

  //     cff.push({'cid': car.cid, 'pos': car.pos, 'vel': vel, 'col': car.col})
  //   })
  //   dragonMaps = cff
  // }

  // function updatePs(tff) {
  //   tff.forEach(function (car){ car.pos = mod(car.pos+car.vel, trSize) })
  // }

  // function applyColor(car) {
  //   switch (car.cid) {
  //     case 0: context.fillStyle = 'red' ; break;
  //     case 1: context.fillStyle = 'orange' ; break;
  //     case 2: context.fillStyle = 'green' ; break;
  //     case 3: context.fillStyle = 'blue' ; break;
  //     case 4: context.fillStyle = 'violet' ; break;
  //     default: context.fillStyle = 'black' ; break;
  //   }
  // }

  // function updateDisplay(tff) {
  //   context.save()
  //   context.translate(0,carSize)
  //   context.drawImage(world.node(), 0, 0)
  //   context.restore()

  //   context.fillStyle = 'white'
  //   context.fillRect(0, 0, world_width, carSize);

  //   // time display
  //   tff.forEach(function(car) {
  //     applyColor(car)
  //     context.fillRect(car.pos, 0, carSize, carSize);
  //   })
  // }

  // function runBlink() {
  //   updateVs(dragonMaps)
  //   updatePs(dragonMaps)
  //   updateDisplay(dragonMaps)
  // }

})()