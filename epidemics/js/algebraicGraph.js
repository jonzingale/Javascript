const matr = [[1,2,3],[4,5,6],[7,8,9]]
const vect = [1,2,3]
const wect = [4,5,6]

const numNodes = 77
const numLinks = 122
const boardSize = 300

function mod(a,b){
  return(((a % b) + b) % b)
}

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

function randomFromList(list) {
  var rr = Math.floor(Math.random() * list.length)
  return list[rr].id
}

function randomAdjacency(num, density) {
  var ary = [], matrx = []

  for (let i=0; i < num**2; i++) {
    Math.random() > density ? ary.push(1) : ary.push(0)
  }

  for (let i=0; i < num; i++) {
    matrx.push(ary.slice(0,num))
  }
  return matrx
}

// nodes: {'id': i, 'group': j}
function generateNodes() {
    var nodes = [] ; for (let i=0; i < numNodes; i++) {
      var g = Math.floor(Math.random()*numNodes)
      nodes.push({id: i, group: g})
    } ; return nodes
}

// TODO: randomly assign remaining edges, no multi-edges.
// links: {'source': id, 'target': id, value: k}
function generateLinks(nodes) {
  var remainingLinks = numLinks - numNodes
  var pi = nodes.slice(0,1)
  var nodes = nodes.slice(1)
  var links = []

  // Tree
  nodes.forEach(function(n, i) {
    var k = Math.floor(Math.random()*numNodes)
    var rSrc = randomFromList(pi)
    pi.push(n)
    links.push({'source': rSrc, 'target': n.id, value: k})
  })

  // TODO: grab pairs of nodes, verify that they have no link,
  // or self loops. Perhaps try building from Adjacency.
  // more links
  // while (remainingLinks > 0) {
    
  // }

  return links
}

function generateGraph() {
  var nodes = generateNodes()
  var links = generateLinks(nodes)
  return {'nodes': nodes, 'links': links}
}

export {innerProduct, vectorTransform, nubList, randomAdjacency,
        removeNode, generateGraph}