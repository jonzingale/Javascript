(function(){

  // Constants
  var world_width = 650,
      world_height = 650,
      controlbox_width = 350,
      controlbox_height = 350,
      n_grid_x = 24,
      n_grid_y = 24

  var scalar = 2
  var hotSpotNum = 80
  var coldSpotNum = 0
  var modWidth = Math.floor(world_width/scalar)
  var modHeight = Math.floor(world_height/scalar)
  var boardSize = modWidth * modHeight

  // moore neighborhood, [ny, nx]
  var moore = [ // write this procedurally?
    [-2, -2],[-2, -1],[-2, 0],[-2, 1],[-2, 2],
    [-1, -2],[-1, -1],[-1, 0],[-1, 1],[-1, 2],
    [ 0, -2],[ 0, -1],[ 0, 0],[ 0, 1],[ 0, 2],
    [ 1, -2],[ 1, -1],[ 1, 0],[ 1, 1],[ 1, 2],
    [ 2, -2],[ 2, -1],[ 2, 0],[ 2, 1],[ 2, 2],
    ]

  var mooreSize = moore.length

  // D3 World settings
  var world = d3.selectAll("#dragonMaps_display").append('canvas')
    .attr('width', world_width)
    .attr('height', world_height)
    .attr("class",'dragonMaps_display')

  var context = world.node().getContext('2d')

  var controls = d3.selectAll("#dragonMaps_controls").append("svg")
    .attr("width",controlbox_width)
    .attr("height",controlbox_height)
    .attr("class","dragonMaps_widgets")

  // Sliders.
  var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);
  var paramsblock = g.block({x0:12,y0:13,width:10,height:8}).Ny(3);

  var sliderwidth = paramsblock.w();
  var handleSize = 14, trackSize = 16;

  var scalars = {id:"scalar", name: "screen refinement scalar", range: [1,5], value: scalar};
  var hotSpotNums = {id:"hotties", name: "number of hot spots", range: [1,200], value: hotSpotNum};
  var coldSpotNums = {id:"coldies", name: "number of cold spots", range: [0,100], value: coldSpotNum};

  var sliders = [
    widget.slider(coldSpotNums).width(sliderwidth)
          .trackSize(trackSize).handleSize(handleSize).update(updatePositions),
    widget.slider(hotSpotNums).width(sliderwidth)
          .trackSize(trackSize).handleSize(handleSize).update(updatePositions),
    widget.slider(scalars).width(sliderwidth).trackSize(trackSize)
          .handleSize(handleSize).update(updatePositions),
  ]

  controls.selectAll(".slider .block3").data(sliders).enter().append(widget.sliderElement)
    .attr("transform",function(d,i){return "translate("+paramsblock.x(0)+","+paramsblock.y(i)+")"});

  // Dragon Maps:
  // The idea here is to make heat maps that would serve
  // as volcanic hotspots and let laplacians smooth the
  // rest of the space. Lastly we add a Sea Level.
  // Variations are supported by balancing smoothing
  // against sea level.

  function mod(a,b){return(((a % b) + b) % b)}

  // board generation
  function genBoard() {
    var accum = []
    var coldScale = (coldSpotNums.value > 0) ? 1 : 0
    var hotSpots =
      hs = [] ; for (let i=0; i < hotSpotNums.value; i++) {
        hs.push(Math.floor(Math.random()*boardSize))
      }

    var coldSpots =
      cs = [] ; for (let i=0; i < Math.floor(coldSpotNums.value); i++) {
        cs.push(Math.floor(Math.random()*boardSize))
      }

    for (let i=0; i < boardSize; i++) {
      if (hotSpots.indexOf(i) > -1) { accum.push(100) }
      else if (coldScale > 0 && coldSpots.indexOf(i) > -1) { accum.push(0) }
      else { accum.push(Math.floor(Math.random()*90) + coldScale) }
    }
    return accum
  }

  // averaging scheme.
  function avgNeighbors(cell, cellIndex) {
    var coldScale = (coldSpotNums.value > 0) ? 1 : 0
    // let alone max hot or max cold, set cold to 1 if on
    if (cell == 100 || cell < coldScale) {return cell}
    else {
      var sum = 0;
      moore.forEach(([ny, nx], i) => {
        cx = mod(cellIndex, modWidth) //0..79
        cy = Math.floor(cellIndex/modHeight) //0..79
        
        xi = mod(cx + nx, modWidth) // x mod 80
        yi = mod(cy + ny, modHeight) // y mod 80
        sum += board[xi + yi * modHeight]
      })
      return (sum / mooreSize)
    }
  }

  // averages neighborhoods over board
  function avgBoard(board) {
    newBoard = []
    board.forEach((c, i) => { newBoard.push(avgNeighbors(c,i)) })
    return(newBoard)
  }

  var newboard;
  function performSmoothing() {
    for (let i=0; i<80; i++){ // smoothing
      newboard = avgBoard(board)
      board = newboard
    }
  }

  // colors the canvas
  function boardToPoints(board) {
    scalar = Math.ceil(scalars.value) || 2
    
    board.forEach((saturation, i) => {
      var x = i % modWidth
      var y = Math.floor(i / modHeight)
      var normedSat = saturation/100

      if (saturation < 45) { // sea level
        context.fillStyle = 'hsl(250,60%,30%)'
      } 
      else if (saturation < 45.08) { // beachs
        context.fillStyle = `hsl(32,71%,${saturation}%)`
      }
      else { // landmass
        // var greenTogrey = 36*normedSat + 120*(1-normedSat)
        // var satDel = 19*normedSat + 100*(1-normedSat)
        // var bright = (saturation/8)*Math.log(saturation*5000) - 40

        var greenTogrey = 36*normedSat + 120*(1-normedSat)
        var satDel = 10*normedSat + 100*(1-normedSat)
        var bright = (saturation/10)*Math.log(saturation*5000) - 40
        // var satDel = 100
        // var bright = 50
        context.fillStyle = `hsl(${greenTogrey},${satDel}%,${bright}%)`
      }
      context.fillRect(x*scalar, y*scalar, scalar, scalar);
    })
  }

  function updatePositions() {
    board = genBoard()
    performSmoothing()
    boardToPoints(board)
  }

  // running the simulation
  context.fillStyle = 'white'
  context.fillRect(0, 0, world_width, world_height);
  updatePositions()

})()