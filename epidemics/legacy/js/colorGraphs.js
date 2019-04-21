(function(){
  const boardSize = 400,
        center = boardSize/2,
        numNodes = 40,
        radius = 30

  //// Buttons and Blocks.
  var graphContainer = d3.selectAll("#graph").append("svg")
    .attr("width",boardSize+100)
    .attr("height",boardSize+100)
    .attr("class","graph")

  var nodeData = [] // data for Cars on Road.
  var dataset = d3.range(numNodes);
  var colors = ['red', 'orange', 'green', 'blue', 'violet']

  dataset.forEach(function(c, i) {
    nodeData.unshift(
      { 'cx': center, 'cy' : center, 'r' : radius,
        'color': d3.interpolateYlOrRd(i/numNodes)
      })
  })

  var nodes = graphContainer.selectAll('circle')
    .data(nodeData).enter().append('circle')

  nodes.style("fill", function (d) { return d.color; })
    .attr("cx", function (d) { return d.cx; })
    .attr("cy", function (d) { return d.cy; })
    .attr("r", function (d) { return d.r; })

  function mod(a,b){return(((a % b) + b) % b)}

  function generateCoordinates() {
    coords = [] ; for (let i=0; i < numNodes; i++) {
      var x = Math.floor(Math.random()*boardSize)
      var y = Math.floor(Math.random()*boardSize)
      coords.push([x,y])
    } ; return coords
  }

  // vector constants
  var vect = [1,2,3]
  var wect = [4,5,6]
  var matr = [[1,2,3],[4,5,6],[7,8,9]]
  var xect = vectorTransform(matr, vect)
  var ns = innerProduct(xect, wect)

  // Vector -> Vector -> Vector
  function innerProduct(v, w) {
    return v.map((e, i) => e*w[i])
  }

  // Matrix -> Vector -> Vector
  function vectorTransform(m, v) {
    var w = m.map(function(e) {
      return innerProduct(e, v).reduce((t, v) => t + v)
    }) ; return w
  }

  // Vector -> N -> Vector
  function nubList(list, i) { var ls = [];
    list.forEach(function(l, j) { if (j!=i) { ls.push(l) }})
    return ls
  }

  // Matrix -> N -> Matrix
  function removeNode(matrx, i) { var mm = [];
    matrx.forEach(function(rs, j) {
      if (j!=i) { mm.push(nubList(rs, i)) }
    }) ; return mm
  }

  function updateDisplay(coords) {
    var cData = coords.map(function([x,y]){
      return { 'cx' : x + 30, 'cy' : y + 30 }
    })

    nodes.data(cData)
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
  }

  coords = generateCoordinates()

  function runBlink() {
    updateDisplay(coords)
  }

  runBlink()

})()