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