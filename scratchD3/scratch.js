
d3.select("body")
  .append("svg")
  .attr("width", 50)
  .attr("height", 50)
  .append("circle")
  .attr("cx", 25)
  .attr("cy", 25)
  .attr("r", 25).style("fill", "purple");

var theData = [ 1, 2, 3 ]

var p = d3.select("body").selectAll("p")
  .data(theData)
  .enter()
  .append("p")
  .text("here ");

function drawCircle(context, radius) {
  context.moveTo(radius, 0);
  context.arc(0, 0, radius, 0, 2 * Math.PI);
}

function rando(){
	return Math.floor(Math.random() * 150);
}

function incr(pos, sig) {
  return ((pos > 280) ? -1 : (pos < 0) ? 1 : sig)
}

function myMove() {
  var elem = document.getElementById("animate");   
  var id = setInterval(frame, 20);
  let pos = 0;
  var sig = 1

  function frame() {
    sig = incr(pos, sig)
    pos += sig

    data = [[rando(), rando()], [rando(), rando()],
    				[rando(), rando()], [rando(), rando()]];

    var lineGenerator = d3.line();
    var pathString = lineGenerator(data);
    d3.select('path').attr('d', pathString)

    elem.style.top = pos + 'px'; 
    elem.style.left = pos + 'px'; 
  }
}


