function network() {
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(
        function(d){ return -d.degree * 2.7} )
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("js/json/gitGraph.json", function(error, graph) {
    if (error) throw error;
    var numNodes = graph.nodes.length

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr('id', function(d) {return d.source+d.target});

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
        .attr('id', function(d) { return d.id })
        .attr("r", function(d) { return d.degree * 3 }) // size of nodes
        .attr('fill', function(d, i) { // color nodes
          return d3.interpolateYlGnBu((numNodes-i)/numNodes)
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  var keyData = [
    {'id': 'susceptible', 'color': d3.interpolateYlGnBu(2/3)},
    {'id': 'infected', 'color': '#fb8072'},
    {'id': 'recovered', 'color': 'white'}]

    svg.append('g')
      .attr("class", "keyNodes")
      .selectAll("circle")
      .data(keyData)
      .enter().append("circle")
        .attr('id', function(d) { return d.id })
        .attr("r", 10).attr('fill', function(d) { return d.color })
        .attr("cx", function(d, i) { return 10 })
        .attr("cy", function(d, i) { return 380+30*i });

    d3.select('.keyNodes')
      .selectAll("text")
      .data(keyData).enter()
      .append("text").text(function(d) { return d.id; })
      .attr("x", function(d, i) { return 8 })
      .attr("y", function(d, i) { return 385+30*i });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
  });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

export { network }
