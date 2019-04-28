from pdb import set_trace as st
import random
import math
import json
import re

class Graph:
  def __init__(self, file):
    decoder = json.JSONDecoder()
    data = decoder.decode(file)
    self.graph = self.format_graph(data)

  def prepareName(self, name):
    return('x' + name.strip('/').lower())

  def format_graph(self, json):
    links, nodes, dictN = [], [], {}

    for src in json:
      psrc = self.prepareName(src)
      for tar in json[src]:
        tar = self.prepareName(tar)

        # build links
        links.append({'source': psrc, 'target': tar})

        # calculate node with degree
        if psrc in dictN: dictN[psrc] += 1
        else: dictN[psrc] = 2

    # ensure target nodes exist in nodes
    for ns in json.values():
      for n in ns:
        node = self.prepareName(n)
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
file = open("./json/dirkbrockmann.json", "r").read()

gr = Graph(file)
gr.data_writer()
# print(gr.graph)
# st()