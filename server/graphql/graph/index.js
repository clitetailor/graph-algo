const { ApolloError, withFilter } = require('apollo-server')

const { typeDefs } = require('./types')
const { pubsub } = require('../pubsub')
const { requireAuth } = require('../../auth')

const GraphAction = {
  GRAPH_ADDED: 'GRAPH_ADDED',
  GRAPH_REMOVED: 'GRAPH_REMOVED',
  GRAPH_UPDATED: 'GRAPH_UPDATED'
}

const resolvers = {
  Query: {
    graphInfos: requireAuth(async (root, args, context) => {
      const { Graph, userId } = context

      const graphs = await Graph.findAll({
        attributes: [
          'id',
          'title',
          'type',
          'userId',
          'nodeCount',
          'edgeCount',
          'createdAt'
        ],
        where: {
          userId
        },
        order: [['updatedAt', 'DESC']]
      })

      return graphs
    }),

    graph: requireAuth(async (root, args, context) => {
      const { id: graphId } = args
      const { Graph, userId } = context

      const graph = await Graph.findOne({
        where: {
          id: graphId,
          userId
        }
      })

      if (!graph) {
        return new ApolloError('No graph exists')
      }

      const {
        id,
        title,
        type,
        data,
        nodeCount,
        edgeCount
      } = graph
      const {
        nodes,
        edges,
        nodeAttributes,
        edgeAttributes
      } = JSON.parse(data)

      return {
        id,
        title,
        type,
        nodes,
        edges,
        nodeAttributes,
        edgeAttributes,
        nodeCount,
        edgeCount
      }
    })
  },

  Mutation: {
    createGraph: requireAuth(async (root, args, context) => {
      const { graph: graphInput } = args
      const { userId, Graph } = context

      const {
        title,
        type,
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges
      } = graphInput

      const data = JSON.stringify({
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges
      })

      const nodeCount = nodes.length
      const edgeCount = edges.length

      const graph = await Graph.create({
        userId,
        data,
        title,
        type,
        nodeCount,
        edgeCount
      })

      const { id } = graph

      const graphAdded = {
        id,
        userId,
        title,
        type,
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges,
        nodeCount,
        edgeCount
      }

      pubsub.publish(GraphAction.GRAPH_ADDED, {
        graphAdded
      })

      return graphAdded
    }),

    updateGraph: requireAuth(async (root, args, context) => {
      const { id: graphId, graph: graphInput } = args
      const { Graph, userId } = context

      const {
        title,
        type,
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges
      } = graphInput

      const data = JSON.stringify({
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges
      })

      const graphUpdated = await Graph.update(
        {
          title,
          type,
          data,
          nodeCount: nodes.length,
          edgeCount: edges.length
        },
        {
          where: {
            id: graphId,
            userId
          }
        }
      )

      if (!graphUpdated) {
        return new ApolloError('No graph exists')
      }

      pubsub.publish(GraphAction.GRAPH_UPDATED, {
        graphUpdated
      })

      return graphUpdated
    }),

    removeGraph: requireAuth(async (root, args, context) => {
      const { id: graphId } = args
      const { Graph, userId } = context

      const graph = await Graph.findOne({
        where: {
          userId,
          id: graphId
        }
      })

      if (!graph) {
        return new ApolloError('No graph exists')
      }

      const {
        id,
        title,
        type,
        data,
        nodeCount,
        edgeCount
      } = graph
      const {
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges
      } = JSON.parse(data)

      const graphRemoved = {
        id,
        userId,
        title,
        type,
        nodeAttributes,
        edgeAttributes,
        nodes,
        edges,
        nodeCount,
        edgeCount
      }

      await graph.destroy()

      pubsub.publish(GraphAction.GRAPH_REMOVED, {
        graphRemoved
      })

      return graphRemoved
    })
  },

  Subscription: {
    graphAdded: {
      subscribe: requireAuth(
        withFilter(
          () => {
            return pubsub.asyncIterator(GraphAction.GRAPH_ADDED)
          },
          (payload, args, context) => {
            return payload.graphAdded.userId === context.userId
          }
        )
      )
    },

    graphUpdated: {
      subscribe: requireAuth(
        withFilter(
          () => {
            return pubsub.asyncIterator(
              GraphAction.GRAPH_UPDATED
            )
          },
          (payload, args, context) => {
            return (
              payload.graphUpdated.userId === context.userId
            )
          }
        )
      )
    },

    graphRemoved: {
      subscribe: requireAuth(
        withFilter(
          () => {
            return pubsub.asyncIterator(
              GraphAction.GRAPH_REMOVED
            )
          },
          (payload, args, context) => {
            return (
              payload.graphRemoved.userId === context.userId
            )
          }
        )
      )
    }
  }
}

const graphSchema = {
  resolvers,
  typeDefs
}

module.exports = {
  graphSchema
}
