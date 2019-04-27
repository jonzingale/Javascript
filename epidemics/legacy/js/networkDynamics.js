// Data manipulation needed for epidemics.
function pp(a) { console.log(JSON.stringify(a)) }
function biasedCoin(prob) { return Math.random() > prob }
function intersect(ary, bry) { return ary.filter(x => bry.includes(x))}
function intersectCount(ary, bry, total=0) {
  ary.forEach(function(x) { if (bry.includes(x)) {total +=1} })
  return total
}

// Generate vectors I, S with T = I + S and <I|S> = 0
function genNamedVectors(graph, den, inf=[], sus=[]) {
  Object.keys(graph).forEach(function(name) {
    biasedCoin(den) ? inf.push(name) : sus.push(name)
  }) ; return([inf, sus])
}

// Update those recovered.
function updateRecovered(infected, rec, bias, inf=[]) {
  infected.forEach(function(name) {
    biasedCoin(bias) ? inf.push(name) : rec.push(name)
  }) ; return [inf, rec]
}

// TODO: IF RECOVERED, NO LONGER AN INFECTED NEIGHBOR.
// Update those susceptible.
function updateSusceptible(graph, infected, susceptible, bias) {
  let inf = [], sus = []

  susceptible.forEach(function(name) {
    let neighs = graph[name]
    let prob = probOR(bias, intersectCount(neighs, infected))
    biasedCoin(prob) ? sus.push(name) : inf.push(name)
  })

  return [inf, sus]
}

function probOR(prob, n) {
  // P(A)+P(B)+P(C)-P(AB)-P(BC)-P(CA)+P(ABC)
  return binomial(n).reduce((a, m, i) =>
    m * prob**(i+1) * (-1)**i + a, 0)
}

function binomial(n, binomials=[[1]]) {
  while(n >= binomials.length) {
    let s = binomials.length;
    let nextRow = [];
    nextRow[0] = 1;
    for(let i=1, prev=s-1; i<s; i++) {
      nextRow[i] = binomials[prev][i-1] + binomials[prev][i];
    }
    nextRow[s] = 1;
    binomials.push(nextRow);
  }

  return binomials[n].slice(1)
}

export { genNamedVectors, updateRecovered, updateSusceptible, pp}