import { GraphType } from './graph'

const defaultGraph = {
  nodes: [],
  edges: []
}

export class UndirectedGraph {
  constructor(graph = defaultGraph) {
    this.type = GraphType.UNDIRECTED_GRAPH

    this.nodeReservedAttributes = [
      { type: 'string', name: 'id', editable: false },
      { type: 'string', name: 'title' },
      { type: 'float', name: 'x', editable: false },
      { type: 'float', name: 'y', editable: false },
      { type: 'float', name: 'vx', editable: false },
      { type: 'float', name: 'vy', editable: false },
      {
        type: 'float',
        name: 'fx',
        hidden: true,
        editable: false
      },
      {
        type: 'float',
        name: 'fy',
        hidden: true,
        editable: false
      },
      { type: 'boolean', name: 'selected', editable: false },
      {
        type: 'int',
        name: 'edgeCount',
        editable: false
      },
      {
        type: 'int',
        name: 'outgoingEdgeCount',
        hidden: true,
        editable: false
      },
      {
        type: 'int',
        name: 'incomingEdgeCount',
        hidden: true,
        editable: false
      },
      {
        type: 'object',
        name: 'meta',
        hidden: true,
        editable: false
      }
    ]
    this.edgeReservedAttributes = [
      { type: 'string', name: 'id' },
      { type: 'string', name: 'sourceId' },
      { type: 'string', name: 'targetId' },
      { type: 'object', name: 'source', hidden: true },
      { type: 'object', name: 'target', hidden: true },
      { type: 'boolean', name: 'selected' },
      { type: 'object', name: 'meta', hidden: true }
    ]
    this.nodeAttributes = graph.nodeAttributes || []
    this.edgeAttributes = graph.edgeAttributes || []

    this.nodes = graph.nodes
    this.edges = graph.edges

    this.selectedNodes = []
    this.selectedEdges = []

    this.counter = 0
    this.directed = true
  }

  static fromJSON(json) {
    const graph = {}
    graph.nodeAttributes = json.nodeAttributes
    graph.edgeAttributes = json.edgeAttributes
    graph.nodes = json.nodes.map(n => {
      return {
        id: n.id,
        x: n.x,
        y: n.y,
        data: n.data,
        edgeCount: 0
        /*
        meta: n.meta.reduce((all, m) => {
          return {
            ...all,
            [m.name]: m.value
          }
        }, {})
        */
      }
    })
    graph.edges = json.edges.map(e => {
      return {
        source: graph.nodes.find(n => n.id === e.sourceId),
        target: graph.nodes.find(n => n.id === e.targetId)
        /*
        meta: e.meta.reduce((all, m) => {
          return {
            ...all,
            [m.name]: m.value
          }
        }, {})
        */
      }
    })

    for (const edge of graph.edges) {
      edge.source.edgeCount += 1
      edge.target.edgeCount += 1
    }

    const undirectedGraph = new UndirectedGraph(graph)
    undirectedGraph.resetCounter()

    return undirectedGraph
  }

  toJSON() {
    const graph = {}
    graph.type = this.type
    graph.nodeAttributes = this.nodeAttributes
    graph.edgeAttributes = this.edgeAttributes
    graph.nodes = this.nodes.map(n => {
      return {
        id: n.id,
        x: n.x,
        y: n.y,
        data: n.data
        /*
        meta: this.nodeAttributes.reduce((all, a) => {
          return {
            ...all,
            [a]: n.meta[a]
          }
        }, {})
        */
      }
    })
    graph.edges = this.edges.map(e => {
      return {
        sourceId: e.source.id,
        targetId: e.target.id
        /*
        meta: this.edgeAttributes.reduce((all, a) => {
          return {
            ...all,
            [a]: n.meta[a]
          }
        }, {})
        */
      }
    })

    return graph
  }

  resetCounter() {
    for (const node of this.nodes) {
      const idN = parseInt(node.id)

      if (idN > this.counter) {
        this.counter = idN
      }
    }
  }

  generateNodeId() {
    this.counter += 1
    const id = this.counter

    return id.toString()
  }

  addNode(node) {
    if (!node.id) {
      node.id = this.generateNodeId()
    } else {
      const existNode = this.nodes.find(n => n.id === node)

      if (existNode) {
        return
      }
    }

    this.nodes.push(node)

    node.edgeCount = 0
  }

  createNodeAt(x, y) {
    this.addNode({
      x,
      y
    })
  }

  removeNode(node) {
    const nodeIndex = this.nodes.find(n => n.id === node.id)

    if (nodeIndex !== -1) {
      this.removeNodeIncidentEdges(node)

      this.node.splice(nodeIndex, 1)
    }
  }

  removeNodeIncidentEdges(node) {
    this.edges = this.edges.filter(
      e => e.source.id === node.id || e.target.id === node.id
    )

    node.edgeCount = 0
  }

  getNodeIncidentEdges(node) {
    return this.edges.filter(
      e => e.source.id === node.id || e.target.id === node.id
    )
  }

  addEdge(source, target) {
    const existEdge = this.edges.find(
      e =>
        (e.source.id === source.id &&
          e.target.id === target.id) ||
        (e.target.id === source.id && e.source.id === target.id)
    )

    if (!existEdge) {
      source.edgeCount += 1
      target.edgeCount += 1

      this.edges.push({
        source,
        target
      })
    }
  }

  removeEdge(edge) {
    const edgeIndex = this.edges.indexOf(edge)

    if (edgeIndex !== -1) {
      edge.source.edgeCount -= 1
      edge.target.edgeCount -= 1

      this.edges.splice(edgeIndex, 1)
    }
  }

  selectNode(node) {
    if (!node.selected) {
      node.selected = true
      this.selectedNodes.push(node)
    }
  }

  getLastSelectedNode() {
    return this.selectedNodes[this.selectedNodes.length - 1]
  }

  deselectNodes() {
    for (const node of this.selectedNodes) {
      node.selected = false
    }
    this.selectedNodes = []
  }

  selectEdge(edge) {
    if (!edge.selected) {
      edge.selected = true
      this.selectedEdges.push(edge)
    }
  }

  deselectEdges() {
    for (const edge of this.selectedEdges) {
      edge.selected = false
    }
    this.selectedEdges = []
  }

  deselectAll() {
    this.deselectNodes()
    this.deselectEdges()
  }

  addNodeAttribute(name, type) {
    const existAttr = this.nodeAttributes.find(
      a => a.name === name
    )

    if (!existAttr) {
      this.nodeAttributes.push({
        name,
        type
      })
    }
  }

  addEdgeAttribute(name, type) {
    const existAttr = this.edgeAttributes.find(
      a => a.name === name
    )

    if (!existAttr) {
      this.edgeAttributes.push({
        name,
        type
      })
    }
  }
}
