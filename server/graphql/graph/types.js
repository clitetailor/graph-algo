const typeDefs = /* GraphQL */ `
  type Node {
    id: ID
    x: Float
    y: Float
  }

  input NodeInput {
    id: ID
    x: Float
    y: Float
  }

  type Edge {
    sourceId: ID
    targetId: ID
  }

  input EdgeInput {
    sourceId: ID
    targetId: ID
  }

  type GraphAttribute {
    type: String
    name: String
  }

  input GraphAttributeInput {
    type: String
    name: String
  }

  type Graph {
    id: ID
    userId: ID
    type: String
    title: String
    nodeAttributes: [GraphAttribute]
    edgeAttributes: [GraphAttribute]
    nodes: [Node]
    edges: [Edge]
    nodeCount: Int
    edgeCount: Int
  }

  input GraphInput {
    title: String
    type: String
    nodeAttributes: [GraphAttributeInput]
    edgeAttributes: [GraphAttributeInput]
    nodes: [NodeInput]
    edges: [EdgeInput]
  }

  extend type Query {
    graphInfos: [Graph]
    graph(id: ID): Graph
  }

  extend type Mutation {
    createGraph(graph: GraphInput): Graph
    updateGraph(id: ID, graph: GraphInput): Graph
    removeGraph(id: ID): Graph
  }

  extend type Subscription {
    graphAdded: Graph
    graphUpdated: Graph
    graphRemoved: Graph
  }
`

module.exports = {
  typeDefs
}
