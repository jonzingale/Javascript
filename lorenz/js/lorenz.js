(function(){

  // var widget = new widgetModule(); // instantiate widget

  var world_width = 400,
      world_height = 400,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24;

  var world = d3.selectAll("#lorenz_display").select("canvas")
  var context = world.node().getContext('2d')
  context.fillStyle = "black"
  // context.attr('border', '1px solid black')

  var controls = d3.selectAll("#lorenz_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","lorenz_widgets")

  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);

  // fixed parameters
  var dt = 0.005, // euler step size
      N = 7000, // # of points
      L = 60, // world size
      ptSize = 2

  var def_sig_param = 10, // viscous diffusion / thermal diffusion
      def_rho_param = 28, // conduction --> convection
      def_beta_param = 8/3, // dimensional parameter
      def_pt_size = 2 // number of points

  var playblock = g.block({x0:5,y0:19,width:0,height:0});
  var buttonblock = g.block({x0:3,y0:12,width:4,height:0}).Nx(2);
  var paramsblock = g.block({x0:12,y0:10,width:10,height:3}).Ny(2);
  var projectionblock = g.block({x0:3,y0:8,width:6,height:3}).Ny(2);

  // Interface:
  var projection = {id:"t1", name: "Projection",  value: true};

  var toggles = [
    widget.toggle(projection).label("right").size(14)
  ]

  // important to have unique id names because Widget is shared
  var playpause = { id:"lorenzplay", name:"", actions: ["play","pause"], value: 0};
  var back = { id:"lorenzback", name:"", actions: ["back"], value: 0};
  var reset = { id:"lorenzreset", name:"", actions: ["rewind"], value: 0};

  var playbutton = [
    widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause)
  ]

  var buttons = [
    widget.button(back).update(resetpositions),
    widget.button(reset).update(resetparameters)
  ]

  var sliderwidth = paramsblock.w();
  var handleSize = 12, trackSize = 8;

  var prandtl = {id:"prandtl", name: "Prandtl", range: [1,20], value: def_sig_param};
  var rayleigh = {id:"rayleigh", name: "Rayleigh", range: [10,40], value: def_rho_param};
  var betaNum = {id:"betaNum", name: "Beta", range: [1,5], value: def_beta_param};
  var ptsSize = {id:"ptsSize", name: "size of points", range: [0.5,4], value: def_pt_size};

  var sliders = [
    widget.slider(ptsSize).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(betaNum).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(prandtl).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(rayleigh).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
  ]

  // Buttons
  controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+playblock.x(0)+","+playblock.y(i)+")"});  

  controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement)
    .attr("transform",function(d,i){return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});  

  // Toggles
  controls.selectAll(".toggle").data(toggles).enter().append(widget.toggleElement)
    .attr("transform",function(d,i){return "translate("+projectionblock.x(0)+","+projectionblock.y(i)+")"});  

  // Sliders
  controls.selectAll(".slider .block3").data(sliders).enter().append(widget.sliderElement)
    .attr("transform",function(d,i){return "translate("+paramsblock.x(0)+","+paramsblock.y(i)+")"});  

  // position scales
  var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
  var Y = d3.scaleLinear().domain([0,L]).range([world_height,0]);

  /////////////////////////
  // this is the agent data 
  /////////////////////////

  var points = d3.range(N).map(function(d,i){
    return {id:i,
            x: Math.random() * L - 30,
            y: Math.random() * L - 30,
            z: Math.random() * L - 3,
    }
  })

  // timer variable for the simulation
  var t;

  // functions for the action buttons
  function runpause(d){ d.value == 1 ? t = d3.timer(runsim,0) : t.stop(); }

  function resetpositions(){
    if (typeof(t) === "object") {t.stop()};
    
    points.forEach(function(d){
      d.x = Math.random() * L - 30;
      d.y = Math.random() * L - 30;
      d.z = Math.random() * L - 3;
    })

    runsim()
  }

  function resetparameters(){
      sliders[0].click(def_pt_size);
      sliders[1].click(def_beta_param);
      sliders[2].click(def_sig_param);
      sliders[3].click(def_rho_param);
  }

  function lorenz(x, y, z) {
      var dx = prandtl.value * (y - x),
          dy = x * (rayleigh.value - z) - y,
          dz = x * y - betaNum.value * z
      return([dx, dy, dz])
  }

  function runsim(){

    points.forEach(function(d){
      // Euler's Method
      var [ ss, tt, rr ] = lorenz(d.x, d.y, d.z)
      var dx = (d.x + ss * dt);
      var dy = (d.y + tt * dt);
      var dz = (d.z + rr * dt);

      var [ ss, tt, rr ] = lorenz (dx, dy, dz)
      var ddx = (dx + ss * dt);
      var ddy = (dy + tt * dt);
      var ddz = (dz + rr * dt);
      d.x = (dx + ddx) / 2
      d.y = (dy + ddy) / 2
      d.z = (dz + ddz) / 2    })

    clearCanvas()
    updateDisplay()
  }

  function clearCanvas() {
    context.fillStyle = "#e6e6e6"
    context.fillRect(0,0, world_width, world_height)
  }

  function updateDisplay() {
    context.fillStyle = "black"
    var ptSize = ptsSize.value

    points.forEach(function(d) {
      var xOut = X(d.x + 30),
          yOut = Y(d.y + 29),
          zOut = Y(d.z + 3)

      switch (projection.value) {
        case true: return(context.fillRect(xOut, zOut, ptSize, ptSize))
        case false: return(context.fillRect(zOut, yOut, ptSize, ptSize))
        default: return(context.fillRect(xOut, yOut, ptSize, ptSize))
      }
    })
  }
  updateDisplay()
})()