import urllib3
from bs4 import BeautifulSoup
from pdb import set_trace as st
import json

# CENTER_NODE = '/benmaier'
CENTER_NODE = '/dirkbrockmann'

URL_FORMAT = "https://github.com%s?tab=followers" 
LINK_CLASS = "d-inline-block no-underline mb-1"

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class Agent:
  def __init__(self):
    self.http = urllib3.PoolManager()
    self.file = open("./json/%s.json" % CENTER_NODE, "w")
    self.json = json.JSONEncoder()
    self.graph = Graph()

  def get_neighbors(self, user_stub):
    html = self.http.request('GET', URL_FORMAT % user_stub)
    page = BeautifulSoup(html.data, features="lxml")
    ns = page.body.find_all('a', attrs={'class':LINK_CLASS})  
    return([href.get('href') for href in ns])

  def walk_network(self, node, radius):
    if (radius > 0):
      ns = self.get_neighbors(node)
      # limit leaves for a node
      if (radius <= 1): ns = ns[0:20]
      self.graph.add_subgraph(node, ns)
      for neighbor in ns:
        self.walk_network(neighbor, radius-1)

  def data_writer(self):
    self.file.write(self.json.encode(self.graph.json))

class Graph:
  def __init__(self):
    self.json = {}
    self.edges = self.json.values()
    self.nodes = self.json.keys()

  # subgraph :: {user_stub: [user_stubs]}
  def add_subgraph(self, node, edges):
    self.json[node] = edges

agent = Agent()
agent.walk_network(CENTER_NODE, 2)
agent.data_writer()
