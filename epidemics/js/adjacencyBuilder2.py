from pdb import set_trace as st
import json

# Rather than build an adjacency matrix which will
# be sparse and thus slow, I build a dictionary with
# arrays for values: {'name': [names]}.

class Graph:
  def __init__(self, dataFile):
    decoder = json.JSONDecoder()
    data = decoder.decode(dataFile)
    self.graph = self.build_graph(data)
    self.data_writer()

  def prepareName(self, name):
    return('x' + name.strip('/').lower())

  def clean_data(self, dirty_data, data={}):
    for name in dirty_data:
      names = {}
      for target in dirty_data[name]:
        names[self.prepareName(target)] = None

      data[self.prepareName(name)] = names
    return(data)

  def build_graph(self, dirty_data):
    data = self.clean_data(dirty_data)
    new_nodes, new_links = {}, {}

    # For all targets not a node, make a node.
    for name in data:
      for target in data[name]:
        if not target in data:
          new_nodes[target] = {}

    data.update(new_nodes)

    # For all targets, make a source edge.
    for name in data:
      for target in data[name]:
        data[target].update({name: None})

    graph = self.format_graph(data)
    return(graph)

  def format_graph(self, data, graph={}):
    for name in data: graph[name] = list(data[name])
    return(graph)

  def data_writer(self):
    encoder = json.JSONEncoder()
    file = open("./json/adjacency.json", "w")
    file.write(encoder.encode(self.graph))


dataFile = open("./json/dirkbrockmann.json", "r").read()
gr = Graph(dataFile)
# st()

