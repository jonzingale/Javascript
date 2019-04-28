// SERVER on 8000: python -m http.server
import { dirksGraph } from './adjacency.js';
import { network } from './network.js';

(function(){
  var controlbox_width = 300,
      controlbox_height = 300,
      n_grid_x = 20,
      n_grid_y = 20

  const graph = dirksGraph()

  var sirData = {'susceptible': [], 'infected': [],
                 'recovered': [], 'transmission': []}

  //// Buttons and Blocks.
  var controls = d3.selectAll("#epidemics_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","epidemics_widgets")

  var g = widget.grid(controlbox_width,controlbox_height, n_grid_x, n_grid_y);
  var playblock = g.block({x0:5,y0:16,width:0,height:0});
  var buttonblock = g.block({x0:12,y0:14,width:4,height:0})
  var sliderBlock = g.block({x0:2,y0:7,width:10,height:5})

  var sliderwidth = sliderBlock.w();
  var handleSize = 8, trackSize = 8;

  var playpause = { id:"b4", name:"run simulation",
                    actions: ["play","pause"], value: 0};

  var reset = { id:"sir_reset", name:"reset",
                actions: ["rewind"], value: 0};

  var buttons = [ widget.button(reset).update(resetNodes) ]

  var playbutton = [
    widget.button(playpause).size(g.x(7))
          .symbolSize(0.6*g.x(7)).update(runpause),
  ]

  // Sliders
  var def_contagion = 14/514
  var def_recovery_rate  = 1/3
  var def_infection_rate = 1/3

  var contagion = {id:"slide_c", name: "concentration of contagion", range: [0.01,1/20], value: def_contagion};
  var recovery_rate = {id:"slide_r", name: "recovery rate", range: [0,1], value: def_recovery_rate};
  var infection_rate = {id:"slide_i", name: "infection rate", range: [0,1], value: def_infection_rate};

  var sliders = [
    widget.slider(infection_rate).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(recovery_rate).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
    widget.slider(contagion).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
  ]

  controls.selectAll(".button .others").data(buttons).enter()
    .append(widget.buttonElement).attr("transform",function(d,i) {
      return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});  

  controls.selectAll(".button .playbutton").data(playbutton).enter()
          .append(widget.buttonElement)
          .attr("transform", function(d,i) {
     return "translate("+playblock.x(0)+","+playblock.y(i)+")"
   });

  controls.selectAll(".slider .block3").data(sliders).enter()
    .append(widget.sliderElement)
    .attr("transform", function(d,i) { 
      return "translate("+sliderBlock.x(0)+","+sliderBlock.y(i*2.5-4)+")"
    });

  var tm; // initialize timer
  function runpause(d){
    d.value == 1 ? tm = setInterval(runEpidemic, 750) : clearInterval(tm)
  }

  function pp(a) { console.log(JSON.stringify(a)) }
  function biasedCoin(prob) { return Math.random() > prob }
  function intersect(ary, bry) { return ary.filter(x => bry.includes(x))}
  function intersectCount(ary, bry, total=0) {
    ary.forEach(function(x) { if (bry.includes(x)) {total +=1} })
    return total
  }
  function probOR(prob, n) { // P(A)+P(B)+P(C)-P(AB)-P(BC)-P(CA)+P(ABC)
    return binomial(n).reduce((a, m, i) => m * prob**(i+1) * (-1)**i + a, 0)
  }

  // Todo: make as lookup table instead?
  function binomial(n, binomials=[[1]]) {
    while(n >= binomials.length) {
      let s = binomials.length;
      let nextRow = [];
      nextRow[0] = 1;
      for(let i=1, prev=s-1; i<s; i++) {
        nextRow[i] = binomials[prev][i-1] + binomials[prev][i];
      }
      nextRow[s] = 1;
      binomials.push(nextRow);
    }

    return binomials[n].slice(1)
  }

  function genNamedVectors(graph, den, inf=[], sus=[]) {
    Object.keys(graph).forEach(function(name) {
      biasedCoin(den) ? sus.push(name) : inf.push(name)
    })

    sirData = {'susceptible': sus, 'infected': inf, 
               'recovered': [], 'transmission': []}
  }

  function contagionLoop(graph) {
    let [oldSus, oldInf, rec, transmission] = Object.values(sirData)
    var inf = [], sus = [], bLinks = []

    // calculate infected
    oldInf.forEach(function(name) {
      biasedCoin(recovery_rate.value) ? inf.push(name) : rec.push(name)
    })

    // calculate susceptible
    oldSus.forEach(function(name) {
      let neighs = graph[name]
      let infectedNeighs = intersect(neighs, oldInf)
      let prob = probOR(infection_rate.value, infectedNeighs.length)

      if (biasedCoin(prob)) {
        sus.push(name)
      } else  {
        oldSus.filter(a => a == !name)
        infectedNeighs.forEach(n => bLinks.push(n+name))
        inf.push(name)
      }
    })

    sirData = {'susceptible': sus, 'infected': inf, 
               'recovered': rec, 'transmission': bLinks}
  }

  function updateDisplay() {
    // reset links to grey
    d3.select('.links').selectAll("line")
      .style('stroke-width', '0.9')
      .style('stroke', '#999')

    // show transmission of infection along link
    sirData['transmission'].forEach(function(link) {
      d3.select('#'+link)
        .style('stroke-width', '1.5')
        .style('stroke', '#fb8072')
    })

    sirData['infected'].forEach(function(name) {
      d3.select('#'+name)
        .style('stroke', 'black')
        .attr('fill', '#fb8072')
    })

    sirData['susceptible'].forEach(function(name) {
      d3.select('#'+name).style('stroke', '#aaa')
    })

    sirData['recovered'].forEach(function(name) {
      d3.select('#'+name)
        .style('stroke', 'black')
        .attr('fill', 'white')
    })
  }

  function runEpidemic() {
    contagionLoop(graph)
    updateDisplay()
  }

  function resetNodes() {
    d3.select('svg').selectAll("*").remove();
    genNamedVectors(graph, contagion.value)
    network()
  }

  resetNodes()
})()
