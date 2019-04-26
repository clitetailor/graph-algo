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
          'userId',
          'nodeCount',
          'edgeCount',
          'createdAt'
        ],
        where: {
          userId
        }
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

      const { data, ...rest } = graph
      const { nodes, edges } = JSON.parse(data)

      return {
        nodes,
        edges,
        ...rest
      }
    })
  },

  Mutation: {
    createGraph: requireAuth(async (root, args, context) => {
      const { graph: graphInput } = args
      const { userId, Graph } = context

      const { title, nodes, edges } = graphInput

      const data = JSON.stringify({
        nodes,
        edges
      })

      const graph = await Graph.create({
        userId,
        title,
        data,
        nodeCount: nodes.length,
        edgeCount: edges.length
      })

      const { id, createdAt } = graph

      const graphAdded = {
        id,
        userId,
        createdAt,
        ...graphInput
      }

      pubsub.publish(GraphAction.GRAPH_ADDED, {
        graphAdded
      })

      return graphAdded
    }),

    updateGraph: requireAuth(async (root, args, context) => {
      const { id: graphId, graph: graphInput } = args
      const { Graph, userId } = context

      const { nodes, edges, ...rest } = graphInput
      const data = JSON.stringify({
        nodes,
        edges
      })

      const graphUpdated = await Graph.update(
        {
          data,
          nodeCount: nodes.length,
          edgeCount: edges.length,
          ...rest
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

      const { data, ...rest } = graph
      const { nodes, edges } = JSON.parse(data)

      const graphRemoved = {
        ...rest,
        nodes,
        edges
      }

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
