import { GraphType } from './graph'

const defaultGraph = {
  title: 'Untitled',
  nodes: [],
  edges: [],
  nodeAttributes: [],
  edgeAttributes: []
}

export class UndirectedGraph {
  constructor(graph = defaultGraph) {
    this.type = GraphType.UNDIRECTED_GRAPH
    this.title = graph.title || defaultGraph.title

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
      { type: 'float', name: 'radius', editable: false },
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
      },
      { type: 'object', name: 'meta', hidden: true }
    ]
    this.edgeReservedAttributes = [
      { type: 'string', name: 'id', hidden: true },
      { type: 'string', name: 'sourceId', editable: false },
      { type: 'string', name: 'targetId', editable: false },
      { type: 'object', name: 'source', hidden: true },
      { type: 'object', name: 'target', hidden: true },
      { type: 'float', name: 'weight', defaultValue: 1 },
      { type: 'boolean', name: 'selected', editable: false },
      { type: 'object', name: 'meta', hidden: true }
    ]
    this.nodeAttributes =
      graph.nodeAttributes || defaultGraph.nodeAttributes
    this.edgeAttributes =
      graph.edgeAttributes || defaultGraph.edgeAttributes

    this.nodes = graph.nodes || defaultGraph.nodes
    this.edges = graph.edges || defaultGraph.edges

    this.selectedNodes = []
    this.selectedEdges = []

    this.counter = 0
    this.directed = true
  }

  static fromJSON(json) {
    const graph = {}
    graph.title = json.title
    graph.nodeAttributes = json.nodeAttributes
    graph.edgeAttributes = json.edgeAttributes
    graph.nodes = json.nodes.map(n => {
      return {
        id: n.id,
        title: n.title,
        title: n.title,
        x: n.x || 0,
        y: n.y || 0,
        data: n.data,
        edgeCount: 0,
        ...(n.meta
          ? n.meta.reduce((target, attr) => {
              return {
                ...target,
                [attr.name]: attr.value
              }
            }, {})
          : {})
      }
    })
    graph.nodes.forEach(n => {
      n.x = parseFloat(n.x)
      n.y = parseFloat(n.y)
    })
    graph.edges = json.edges.map(e => {
      return {
        source: graph.nodes.find(n => n.id === e.sourceId),
        target: graph.nodes.find(n => n.id === e.targetId),
        weight: e.weight,
        ...(e.meta
          ? e.meta.reduce((target, attr) => {
              return {
                ...target,
                [attr.name]: attr.value
              }
            }, {})
          : {})
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
    graph.title = this.title
    graph.nodeAttributes = this.nodeAttributes.map(attr => {
      return {
        type: attr.type,
        name: attr.name,
        defaultValue: attr.defaultValue
      }
    })
    graph.edgeAttributes = this.edgeAttributes.map(attr => {
      return {
        type: attr.type,
        name: attr.name,
        defaultValue: attr.defaultValue
      }
    })
    graph.nodes = this.nodes.map(n => {
      return {
        id: n.id,
        title: n.title,
        x: n.x,
        y: n.y,
        data: n.data,
        meta: this.nodeAttributes
          .map(attr => {
            return n[attr.name] !== undefined
              ? {
                  name: attr.name,
                  value: n[attr.name]
                }
              : null
          })
          .filter(attr => attr !== null)
      }
    })
    graph.edges = this.edges.map(e => {
      return {
        sourceId: e.source.id,
        targetId: e.target.id,
        weight: e.weight,
        meta: this.edgeAttributes
          .map(attr => {
            return e[attr.name] !== undefined
              ? {
                  name: attr.name,
                  value: e[attr.name]
                }
              : null
          })
          .filter(attr => attr !== null)
      }
    })

    return graph
  }

  resetCounter() {
    for (const node of this.nodes) {
      const matchGroup = node.id && node.id.match(/([0-9]+)/)

      const idN = parseInt((matchGroup && matchGroup[0]) || 0)

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
    const nodeIndex = this.nodes.findIndex(
      n => n.id === node.id
    )

    if (nodeIndex !== -1) {
      this.removeNodeIncidentEdges(node)

      this.nodes.splice(nodeIndex, 1)
    }
  }

  removeNodeIncidentEdges(node) {
    this.edges = this.edges.filter(
      e => e.source.id !== node.id && e.target.id !== node.id
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
      const edge = {
        source,
        target,
        weight: this.getEdgeAttribute('weight').defaultValue
      }

      this.edges.push(edge)

      source.edgeCount += 1
      target.edgeCount += 1
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

  hasNodeAttribute(attr) {
    return (
      this.nodeAttributes.find(a => a.name === attr.name) ||
      this.nodeReservedAttributes.find(
        a => a.name === attr.name
      )
    )
  }

  addNodeAttribute(attr) {
    this.nodeAttributes.push(attr)
  }

  removeNodeAttribute(attr) {
    this.nodeAttributes = this.nodeAttributes.filter(
      a => a.name !== attr.name
    )
  }

  getNodeAttribute(attrName) {
    return (
      this.nodeReservedAttributes.find(
        a => a.name === attrName
      ) || this.nodeAttributes.find(a => a.name === attrName)
    )
  }

  hasEdgeAttribute(attr) {
    return (
      this.edgeAttributes.find(a => a.name === attr.name) ||
      this.edgeReservedAttributes.find(
        a => a.name === attr.name
      )
    )
  }

  addEdgeAttribute(attr) {
    this.edgeAttributes.push(attr)
  }

  getEdgeAttribute(attrName) {
    return (
      this.edgeReservedAttributes.find(
        a => a.name === attrName
      ) || this.edgeAttributes.find(a => a.name === attrName)
    )
  }

  removeEdgeAttribute(attr) {
    this.edgeAttributes = this.edgeAttributes.filter(
      a => a.name !== attr.name
    )
  }
}
