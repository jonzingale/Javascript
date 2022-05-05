import * as math from 'mathjs';

const m1 = math.matrix(
  [[1, 1, 0, 0, 0],
   [1, 1, 1, 0, 0],
   [0, 1, 1, 1, 0],
   [0, 0, 1, 1, 1],
   [0, 0, 0, 1, 1]]
) 

const m2 = math.matrix(
  [[1, 1, 0, 0],
   [1, 1, 1, 0],
   [0, 1, 1, 1],
   [0, 0, 1, 1]]
)

// inv(l4)*l54
const ls = math.matrix(
  [[1, 0, 1, 1, 0],
   [0, 0, 1, 1, 0],
   [1, 1, 0, 0, 0],
   [1, 1, 0, 1, 0]]
)

const i4 = math.identity(4)

export { m1, m2, ls, i4 } ;