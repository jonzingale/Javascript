const vect = [1,2,3]
const wect = [4,5,6]

const matr = [[1,2,3],
              [4,5,6],
              [7,8,9]]

const numNodes = 120

function longVect() {
  ary = []
  for (let i=0; i<514; i++) {
    ary.push(Math.floor(Math.random() + 0.5))
  }
}

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
function nubList(list, i, ls=[]) {
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

function randomAdjacency(num, density, matrx=[]) {
  // lower triangular
  for (let i=0; i < num; i++) {
    var row = [] ; for (let j=0; j < num; j++) {
      j < i && Math.random() > density ? row.push(1) : row.push(0)
    } ; matrx.push(row)
  }

  return mSum(matrx, tr(matrx))
}

// nodes: {'id': i, 'group': j}
function generateNodes() {
  var nodes = [] ; for (let i=0; i < numNodes; i++) {
    var g = Math.floor(Math.random()*numNodes)
    nodes.push({id: i, group: g})
  } ; return nodes
}

function rNode() {
  return Math.floor(Math.random()*numNodes)
}

// links: {'source': id, 'target': id, value: k}
function generateTree(nodes, links=[]) {
  var pi = nodes.slice(0,1), nodes = nodes.slice(1)

  // Tree
  nodes.forEach(function(n, i) {
    var k = Math.floor(Math.random()*numNodes)
    var rSrc = randomFromList(pi)
    pi.push(n)
    links.push({'source': rSrc, 'target': n.id, value: k})
  })

  // add cycles
  for (let i=0; i < numNodes/Math.log(numNodes); i++) {
    links.push({'source': rNode(), 'target': rNode(), 'value': rNode()})
  }

  return links
}

// links: {'source': id, 'target': id, value: k}
function generateLinks(nodes, adj, links=[]) {
  nodes.forEach(function(n, i) {
    for (let j=0; j < i; j++) {
      if (adj[i][j] == 1) {
        links.push({'source': nodes[j], 'target': n.id,
          'value': Math.floor(Math.random()*numNodes)})        
      }
    }
  })

  return links
}

var adjM = randomAdjacency(numNodes, 0.98)

function generateGraph() {
  var nodes = generateNodes()
  // var links = generateLinks(nodes, adjM)
  // var links = ... Real Data from somewhere.
  var links = generateTree(nodes)
  return {'nodes': nodes, 'links': links}
}

export {innerProduct, vectorTransform, nubList, randomAdjacency,
        removeNode, generateGraph}