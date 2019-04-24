from pdb import set_trace as st
import json
import re

class Graph:
  def __init__(self, json):
    self.links = self.format_links(json)
    self.nodes = self.format_nodes(json)
    self.graph = {**self.nodes, **self.links}

  def format_nodes(self, json):
    nodes, dictN = [], {}

    for ns in json.values():
      for n in ns:
        dictN[n.strip('/')] = None

    for n in json.keys():
      dictN[n.strip('/')] = None

    for n in dictN.keys():
      nodes.append({'id': n})

    return({'nodes': nodes})

  def format_links(self, json):
    links = []
    for src in json.keys():
      for tar in json[src]:
        links.append(
          {'source': src.strip('/'),
           'target': tar.strip('/'),
           'value': 10})

    return({'links': links})

  def data_writer(self):
    encoder = json.JSONEncoder()
    file = open("./json/gitGraph.json", "w")
    file.write(encoder.encode(self.graph))

decoder = json.JSONDecoder()
file = open("./json/twoDegree.json", "r").read()
data = decoder.decode(file)

gr = Graph(data)
gr.data_writer()
# print(gr.graph)