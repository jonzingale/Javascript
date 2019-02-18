(function(){

  var world_width = 400,
      world_height = 400,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24,
      L = 0,
      k = world_width/L

  // var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  // var Y = d3.scaleLinear().domain([0,L]).range([world_height,0]);

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
  var buttonblock = g.block({x0:15,y0:19,width:4,height:0}).Nx(2);

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
    d.value == 1 ? tm = setInterval(runBlink, 50) : clearInterval(tm)
    // d.value == 1 ? t = d3.timer(runBlink,0) : t.stop()
  }

  var y = 0 // initializes y position
  function resetpositions() {
    if (typeof(t) === "object") {clearInterval(tm)};
    y = 0; context.fillStyle = 'white'
    context.fillRect(0, 0, world_width, world_width);
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

  // chooses n, an ordered but random subset of p.
  function randPositions(p, n) {
    var rPositions = []
    var zeroToP = []
    var r = 0

    // gives the total possible car positions
    while (p>=0) { zeroToP.unshift(p) ; p-=1}

    // iteratively choose n possible positions
    i = 0 ; while (n > i) {
      r = Math.floor(Math.random() * zeroToP.length)
      rPositions.unshift(zeroToP[r])
      zeroToP = zeroToP.filter(p => p != zeroToP[r])
      i += 1
    }

    rPositions.sort(function(a, b){return a-b})
    return rPositions
  }

  var maxV = 5
  var carSize = 2
  var trSize = world_width
  var numCars = 10
  var traffic = randTraffic(trSize, numCars)
  var braking = 2
  var prob = 2/3

  // available positions -> # cars -> Traffic
  function randTraffic(p, n) {
    var pps = randPositions(p, n)
    var [cars, vvs] = [[],[]]
    var rando = 0

    for (i=0; i < p; i++) {
      rando = Math.floor(Math.random() * maxV)
      vvs.push(rando)
    }

    for (i=0; i < n; i++) {
      [p, v] = [pps.shift(), vvs.shift()]
      cars.unshift({'id': n-i-1, 'pos': p, 'vel': v})
    }
    return cars
  }

  function updateVs(tff) {
    tff.forEach(function(car) {
      var nextCar = tff[mod(car.id + 1, numCars)]
      var d = mod(nextCar.pos - car.pos, trSize)

      // update velocity
      if (d > maxV && car.vel < maxV) { car.vel = car.vel + 1 } 
      else if (car.vel >= d) { car.vel = d}

      // jitters
      var b = 0 ; if (Math.random() > prob) {b = 1}
      // if (car.vel > braking && car.vel >= d)
      if (car.vel > braking)

        { car.vel = car.vel - b*braking }
    })
  }

  function updatePs(tff) {
    tff.forEach(function (car){
      car.pos = mod(car.pos+car.vel, trSize)
    })
  }

  function updateDisplay(tff) {
    context.save()
    context.translate(0,carSize)
    context.drawImage(world.node(), 0, 0)
    context.restore()

    context.fillStyle = 'white'
    context.fillRect(0, 0, world_width, carSize);

    tff.forEach(function(c) {
      context.fillStyle = 'black'
      if (c['id'] == 1) { context.fillStyle = 'red' }
      context.fillRect(c.pos, L-y, carSize, carSize);
    })
  }

  function runBlink() {
    updatePs(traffic)
    updateVs(traffic)
    updateDisplay(traffic)
    y = 0 //mod(y+1, L)
  }

})()