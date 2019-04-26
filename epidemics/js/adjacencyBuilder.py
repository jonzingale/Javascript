from pdb import set_trace as st
import json

class Graph:
  def __init__(self, nodeFile, dataFile):
    decoder = json.JSONDecoder()
    graph = decoder.decode(nodeFile)
    data = decoder.decode(dataFile)
    self.adjacency = self.build_graph(graph, data)
    self.data_writer()

  def data_writer(self):
    encoder = json.JSONEncoder()
    file = open("./json/adjacency.json", "w")
    vals = list(self.adjacency.values())
    file.write(encoder.encode(vals))

  def build_graph(self, graph, data):
    nodes, links = graph.values()
    indexed_names = {}
    adj = {}

    link_pairs = []
    for link in links:
      s, t = link.values()
      pair = [s.lower(), t.lower()]
      pair.sort()
      link_pairs.append(pair)

    node_pairs = []
    for i in nodes:
      adj[i['id'].lower()] = []
      for j in nodes:
        node_pairs.append([i['id'].lower(), j['id'].lower()])

    for name in node_pairs:
      row = []
      for link in link_pairs:
        if name == link: row.append(1)
        else: row.append(0)
      adj[name[0]].append(row)

    return(adj)

nodeFile = open("./json/gitGraph.json", "r").read()
dataFile = open("./json/dirkbrockmann.json", "r").read()

gr = Graph(nodeFile, dataFile)


