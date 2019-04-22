const matr = [[1,2,3],[4,5,6],[7,8,9]]
const tri  = [[0,0,0,0],[1,0,0,0],[1,1,0,0],[1,1,1,0]]

const vect = [1,2,3]
const wect = [4,5,6]

const numNodes = 77
const numLinks = 122
const boardSize = 300

function mod(a,b) {
  return(((a % b) + b) % b)
}

// Matrix -> Matrix
function tr(ms, newMatrx=[]) {
  for (let i=0; i < ms.length ; i++) {
    newMatrx.push(ms.map(vs => vs[0]))
    ms = ms.map(vs => vs.slice(1))
  } ; return newMatrx
}

function mSum(ms, ns, mm=[]) {
  for (let i=0; i < ms.length ; i++) {
    var vs = ms[i].map((v, j) => v + ns[i][j])
    mm.push(vs)
  } ; return mm
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
  var matrx = []

  // lower triangular
  for (let i=0; i < num; i++) {
    var row = [] ; for (let j=0; j < num; j++) {
      j<i && Math.random() > density ? row.push(1) : row.push(0)
    } ; matrx.push(row)
  }
  // full adjacency
  return mSum(matrx, tr(matrx))
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

  return links
}

function generateGraph() {
  var nodes = generateNodes()
  var links = generateLinks(nodes)
  return {'nodes': nodes, 'links': links}
}

export {innerProduct, vectorTransform, nubList, randomAdjacency,
        removeNode, generateGraph}