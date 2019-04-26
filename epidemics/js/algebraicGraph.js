const vect = [1,2,3]
const wect = [4,5,6]

const network = {'n1': ['n2', 'n3'], 'n2': ['n1'], 'n3': ['n1']}


// Rewrite this code in terms of the new DataStructure:
// {name: [names], ..., name: [names]}

function pp(a) { console.log(JSON.stringify(a)) }

d3.json('js/json/adjacency.json', function(error, graph) {  

  pp(genNamedVectors(graph, 0.5)['infected'].length)

})

// generate vectors I, S with T = I + S and <I|S> = 0
function genNamedVectors(graph, den, inf=[], sus=[]) {
  var numNodes = Object.keys(graph).length
  Object.keys(graph).forEach(function(name) {
    Math.random() > den ? inf.push(name) : sus.push(name)
  })
  return({'infected': inf, 'susceptible': sus})
}


// Matrix -> Matrix
function tr(ms, newMatrx=[]) {
  for (let i=0; i < ms.length ; i++) {
    newMatrx.push(ms.map(vs => vs[0]))
    ms = ms.map(vs => vs.slice(1))
  } ; return newMatrx
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


export {innerProduct, vectorTransform, nubList, removeNode,}