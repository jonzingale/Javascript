const vect = [1,2,3]
const wect = [4,5,6]

const matr = [[1,2,3],
              [4,5,6],
              [7,8,9]]

const numNodes = 120

// Rewrite this code in terms of the new DataStructure:
// {name: [names], ..., name: [names]}

d3.json('js/json/adjacency.json', function(error, graph) {
  console.log(JSON.stringify(graph['dirkbrockmann']))
})

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


export {innerProduct, vectorTransform, nubList,
        removeNode,}