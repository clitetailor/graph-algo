import { GraphType } from './graph'

const defaultGraph = {
  nodes: [],
  edges: []
}

export class DirectedGraph {
  constructor(graph = defaultGraph) {
    this.type = GraphType.DIRECTED_GRAPH

    this.nodeReservedAttributes = [
      { type: 'string', name: 'id' },
      { type: 'float', name: 'x' },
      { type: 'float', name: 'y' },
      { type: 'float', name: 'vx' },
      { type: 'float', name: 'vy' },
      { type: 'float', name: 'fx' },
      { type: 'float', name: 'fy' },
      { type: 'boolean', name: 'selected' },
      { type: 'number', name: 'edgeCount' },
      { type: 'number', name: 'outgoingEdgeCount' },
      { type: 'number', name: 'incomingEdgeCount' }
    ]
    this.edgeReservedAttributes = [
      { type: 'string', name: 'id' },
      { type: 'string', name: 'sourceId' },
      { type: 'string', name: 'targetId' },
      { type: 'object', name: 'source', hidden: true },
      { type: 'object', name: 'target', hidden: true },
      { type: 'boolean', name: 'selected' },
      { type: 'boolean', name: 'bidirect' }
    ]
    this.nodeAttributes = []
    this.edgeAttributes = []

    this.nodes = graph.nodes
    this.edges = graph.edges

    this.selectedNodes = []
    this.selectedEdges = []

    this.counter = 0
  }

  static fromJSON(json) {
    const graph = {}
    graph.nodes = json.nodes.map(n => {
      return {
        id: n.id,
        x: n.x,
        y: n.y,
        data: n.data,
        edgeCount: 0,
        outgoingEdgeCount: 0,
        incomingEdgeCount: 0
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
      edge.source.outgoingEdgeCount += 1
      edge.target.incomingEdgeCount += 1
    }

    const directedGraph = new DirectedGraph(graph)
    directedGraph.resetCounter()

    return directedGraph
  }

  toJSON() {
    const graph = {}
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
    const id = this.counter
    this.counter += 1

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

    node.edgeCount = 0
    node.outgoingEdgeCount = 0
    node.incomingEdgeCount = 0

    this.nodes.push(node)
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

  getNodeIncidentEdges(node) {
    return this.edges.filter(
      e => e.source.id === node.id || e.target.id === node.id
    )
  }

  getNodeOutgoingEdges(node) {
    return this.edges.filter(e => e.source.id === node.id)
  }

  getNodeIncomingEdges(node) {
    return this.edges.filter(e => e.target.id === node.id)
  }

  findReverseEdge(edge) {
    return this.edges.find(
      e =>
        e.target.id === edge.source.id &&
        e.source.id === edge.target.id
    )
  }

  removeNodeIncidentEdges(node) {
    this.edges = this.edges.filter(
      e => e.source.id !== node.id && e.target.id !== node.id
    )

    node.edgeCount = 0
  }

  removeNodeOutgoingEdges(node) {
    this.edges = this.edges.filter(e => e.source.id !== node.id)
  }

  removeNodeIncomingEdges(node) {
    this.edges = this.edges.filter(e => e.target.id !== node.id)
  }

  addEdge(source, target) {
    const existEdge = this.edges.find(
      e =>
        (e.source.id === source.id &&
          e.target.id === target.id) ||
        (e.target.id === source.id && e.source.id === target.id)
    )

    if (!existEdge) {
      const edge = {
        source,
        target
      }
      const reverseEdge = this.findReverseEdge(edge)

      if (reverseEdge) {
        edge.bidirect = true
        reverseEdge.bidirect = true
      } else {
        edge.bidirect = false
      }

      this.edges.push(edge)

      source.edgeCount += 1
      target.edgeCount += 1
      source.outgoingEdgeCount += 1
      target.incomingEdgeCount += 1
    }
  }

  removeEdge(edge) {
    const edgeIndex = this.edges.indexOf(edge)

    if (edgeIndex !== -1) {
      const reverseEdge = this.findReverseEdge(edge)

      if (reverseEdge) {
        reverseEdge.bidirect = false
      }

      edge.source.edgeCount -= 1
      edge.target.edgeCount -= 1
      edge.source.outgoingEdgeCount -= 1
      edge.target.incomingEdgeCount -= 1

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
