(function(){

  var world_width = 400,
      world_height = 600,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24

  var world = d3.selectAll("#traffic_display").append('canvas')
    .attr('width', world_width)
    .attr('height', world_height)
    .attr("class",'traffic_display')

  var context = world.node().getContext('2d')

  var controls = d3.selectAll("#traffic_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","traffic_widgets")

  // Play button.
  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);
  var playblock = g.block({x0:5,y0:19,width:0,height:0});
  var buttonblock = g.block({x0:13,y0:19,width:4,height:0}).Nx(2);

  var playpause = { id:"b4", name:"play / pause",
                    actions: ["play","pause"], value: 0};

  var reset = { id:"b6", name:"reset", actions: ["rewind"], value: 0};

  var playbutton = [
   widget.button(playpause).size(g.x(7))
         .symbolSize(0.6*g.x(7)).update(runpause)
  ]

  var buttons = [
    widget.button(reset).update(resetpositions),
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

  var tm; // initialize timer
  function runpause(d){
    d.value == 1 ? tm = setInterval(runBlink, 25) : clearInterval(tm)
  }

  function resetpositions() {
    if (typeof(t) === "object") {clearInterval(tm)};
    context.fillStyle = 'white'
    context.fillRect(0, 0, world_width, world_height);
    var traffic = randTraffic(trSize, trSize/3)
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

  // Constants
  var maxV = 7
  var braking = 4
  var carSize = 2
  var trSize = world_width
  var numCars = Math.floor(35/100*world_width/carSize)
  var traffic = randTraffic(trSize, numCars)
  var prob = 1/3

  // chooses n, an ordered but random subset of p.
  function randPositions(p, n) {
    var rPositions = []
    var zeroToP = []
    var r = 0

    // gives the total possible car positions
    for (i=0; i < p; i++) { zeroToP.unshift(i) }

    // iteratively choose n possible positions
    for (i=0; i < n; i++ ) {
      r = Math.floor(Math.random() * zeroToP.length)
      rPositions.unshift(zeroToP[r])
      zeroToP = zeroToP.filter(p => p != zeroToP[r])
    }

    rPositions.sort(function(a, b){return b-a})
    return rPositions
  }

  // available positions -> # cars -> Traffic
  function randTraffic(p, n) {
    var pps = randPositions(p, n)
    var [cars, vvs] = [[],[]]
    var rando = 0

    for (i=0; i < p; i++) {
      vvs.push(1+Math.floor(Math.random() * (maxV-1)))
    }

    for (i=0; i < n; i++) {
      [p, v] = [pps.shift(), vvs.shift()]
      cars.unshift({'cid': n-i-1, 'pos': p, 'vel': v})
    }
    return cars
  }

  function updateVs(tff) {
    var cff = []

    tff.forEach(function(car) {
      var b = 0 ; if (Math.random() < prob) {b = 1}
      var prevCar = tff[mod(car.cid - 1, numCars)]
      var nextCar = tff[mod(car.cid + 1, numCars)]
      var dn = mod(nextCar.pos - car.pos, trSize)
      var dp = mod(car.pos - prevCar.pos, trSize)
      var vel = 0

      // update velocity
      if (dn > maxV && maxV > car.vel) { vel = car.vel + 1 } // go max speed
      else if (car.vel > dn) { vel = dn } // too fast, slow down
      else { vel = car.vel } // just right

      // jitters
      if (vel > braking) { vel -= b*Math.min(braking, dp) }

      cff.push({'cid': car.cid, 'pos': car.pos, 'vel': vel})
    })
    traffic = cff
  }

  function updatePs(tff) {
    tff.forEach(function (car){
      car.pos = mod(car.pos+car.vel, trSize)
    })
  }

  function applyColor(car) {
    switch (car.cid) {
      case 0: context.fillStyle = 'red' ; break;
      case 1: context.fillStyle = 'orange' ; break;
      case 2: context.fillStyle = 'green' ; break;
      case 3: context.fillStyle = 'blue' ; break;
      case 4: context.fillStyle = 'violet' ; break;
      default: context.fillStyle = 'black' ; break;
    }
  }

  function updateDisplay(tff) {
    context.save()
    context.translate(0,carSize)
    context.drawImage(world.node(), 0, 0)
    context.restore()

    context.fillStyle = 'white'
    context.fillRect(0, 0, world_width, carSize);

    tff.forEach(function(car) {
      applyColor(car)
      context.fillRect(car.pos, 0, carSize, carSize);
    })
  }

  function runBlink() {
    updateVs(traffic)
    updatePs(traffic)
    updateDisplay(traffic)
  }

})()