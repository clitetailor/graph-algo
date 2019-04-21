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

  type Graph {
    id: ID
    userId: ID
    title: String
    nodes: [Node]
    edges: [Edge]
    nodeCount: Int
    edgeCount: Int
  }

  input GraphInput {
    title: String
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
