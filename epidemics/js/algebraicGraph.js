const matr = [[1,2,3],[4,5,6],[7,8,9]]
const vect = [1,2,3]
const wect = [4,5,6]

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

function generateCoordinates() {
    var nodes = [] ; for (let i=0; i < numNodes; i++) {
      var x = Math.floor(Math.random()*boardSize)
      var y = Math.floor(Math.random()*boardSize)
      nodes.push([x,y])
    } ; return nodes
}


export {innerProduct, vectorTransform, nubList,
        removeNode, generateCoordinates}