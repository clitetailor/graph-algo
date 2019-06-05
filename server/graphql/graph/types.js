const typeDefs = /* GraphQL */ `
  type Node {
    id: ID
    title: String
    x: Float
    y: Float
    meta: [GraphAttributeData]
  }

  input NodeInput {
    id: ID
    title: String
    x: Float
    y: Float
    meta: [GraphAttributeDataInput]
  }

  type Edge {
    sourceId: ID
    targetId: ID
    weight: Float
    meta: [GraphAttributeData]
  }

  input EdgeInput {
    sourceId: ID
    targetId: ID
    weight: Float
    meta: [GraphAttributeDataInput]
  }

  type GraphAttribute {
    type: String
    name: String
    defaultValue: Any
  }

  input GraphAttributeInput {
    type: String
    name: String
    defaultValue: Any
  }

  type GraphAttributeData {
    name: String
    value: Any
  }

  input GraphAttributeDataInput {
    name: String
    value: Any
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
