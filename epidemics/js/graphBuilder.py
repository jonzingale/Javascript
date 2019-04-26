from pdb import set_trace as st
import random
import math
import json
import re

class Graph:
  def __init__(self, json):
    self.graph = self.format_graph(json)

  def format_graph(self, json):
    links, nodes, dictN = [], [], {}

    for src in json:
      for tar in json[src]:
        src = src.strip('/')
        tar = tar.strip('/')

        # build links
        links.append({'source': src, 'target': tar})

        # calculate node with degree
        if src in dictN: dictN[src] += 1
        else: dictN[src] = 2

    # ensure target nodes exist in nodes
    for ns in json.values():
      for n in ns:
        node = n.strip('/')
        if not node in dictN: dictN[node] = 2

    # build nodes
    for n in dictN:
      if dictN[n] > 0:
        deg = math.log(dictN[n])
        nodes.append({'id': n, 'degree': deg})

    return({'nodes': nodes, 'links': links})

  def data_writer(self):
    encoder = json.JSONEncoder()
    file = open("./json/gitGraph.json", "w")
    file.write(encoder.encode(self.graph))

# file = open("./json/benmaier.json", "r").read()
# file = open("./json/jonzingale.json", "r").read()
# file = open("./json/dirkbrockmann.json", "r").read()
file = open("./json/mothtamer.json", "r").read()

# file = open("./json/gitData.json", "r").read()
decoder = json.JSONDecoder()
data = decoder.decode(file)

gr = Graph(data)
gr.data_writer()
# print(gr.graph)
# st()