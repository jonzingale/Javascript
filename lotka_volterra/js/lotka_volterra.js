(function(){

  // var widget = new widgetModule(); // instantiate widget

  var world_width = 400,
      world_height = 400,
      controlbox_width = 400,
      controlbox_height = 400,
      n_grid_x = 24,
      n_grid_y = 24;

  var world = d3.selectAll("#lotka_volterra_display").select("canvas")
  var context = world.node().getContext('2d')
  context.fillStyle = "black"

  var controls = d3.selectAll("#lotka_volterra_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","lotka_volterra_widgets")

  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);

  // fixed parameters
  var dt = 0.01, // euler step size
      N = 9000, // # of points
      L = 20, // world size
      ptSize = 2

  var def_alpha_param = 2/3,
      def_beta_param = 4/3,
      def_delta_param = 1,
      def_gamma_param = 1,
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
  var playpause = { id:"lotkaplay", name:"", actions: ["play","pause"], value: 0};
  var back = { id:"lotkaback", name:"", actions: ["back"], value: 0};
  var reset = { id:"lotkareset", name:"", actions: ["rewind"], value: 0};

  var playbutton = [
    widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause)
  ]

  var buttons = [
    widget.button(back).update(resetpositions),
    widget.button(reset).update(resetparameters)
  ]

  var sliderwidth = paramsblock.w();
  var handleSize = 12, trackSize = 8;

  var alpha = {id:"alpha", name: "Alpha", range: [0,2], value: def_alpha_param};
  var beta = {id:"beta", name: "Beta", range: [0,2], value: def_beta_param};
  var delta = {id:"delta", name: "Delta", range: [0,2], value: def_delta_param};
  var gamma = {id:"gamma", name: "Gamma", range: [0,10], value: def_gamma_param};
  var ptsSize = {id:"ptsSize", name: "size of points", range: [1,4], value: def_pt_size};

  var sliders = [
    widget.slider(ptsSize).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(gamma).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(delta).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(beta).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(alpha).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
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

  var points = d3.range(N).map(function(d,i){
    return {id:i,
            x: Math.random() * L,
            y: 0.01,// Math.random() * L,
            z: 1,
    }
  })

  // timer variable for the simulation
  var t;

  // functions for the action buttons
  function runpause(d){ d.value == 1 ? t = d3.timer(runsim,0) : t.stop(); }

  function resetpositions(){
    if (typeof(t) === "object") {t.stop()};
    
    points.forEach(function(d){
      d.x = Math.random() * L;
      d.y = Math.random() * L;
      d.z = 1;
    })

    runsim()
  }

  function resetparameters(){
      sliders[0].click(def_pt_size);
      sliders[1].click(def_gamma_param);
      sliders[2].click(def_delta_param);
      sliders[3].click(def_beta_param);
      sliders[4].click(def_alpha_param);
  }

  function lotkaVolterra(x, y, z) {
      var dx = alpha.value * x - beta.value * x*y
          dy = delta.value * x*y - gamma.value * y
          dz = 1
      return([dx, dy, dz])
  }

  function eulersMethod(){
    points.forEach(function(d){
      var [ ss, tt, rr ] = lotkaVolterra(d.x, d.y, d.z)
      var dx = (d.x + ss * dt);
      var dy = (d.y + tt * dt);
      var dz = (d.z + rr * dt);

      var [ ss, tt, rr ] = lotkaVolterra (dx, dy, dz)
      var ddx = (dx + ss * dt);
      var ddy = (dy + tt * dt);
      var ddz = (dz + rr * dt);
      d.x = (dx + ddx) / 2
      d.y = (dy + ddy) / 2
      d.z = (dz + ddz) / 2    })
  }

  function runsim(){
    eulersMethod()
    clearCanvas()
    updateDisplay()
  }

  function clearCanvas() {
    context.fillStyle =  "rgb(220,220,220,0.1)"
    context.fillRect(0,0, world_width, world_height)
  }

  function updateDisplay() {
    context.fillStyle = "black"
    var ptSize = ptsSize.value

    points.forEach(function(d) {
      context.fillRect(X(d.x), Y(d.y), ptSize, ptSize)
    })
  }

  updateDisplay()
})()