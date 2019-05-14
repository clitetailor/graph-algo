const { makeExecutableSchema } = require('apollo-server')
const { merge } = require('lodash')

const { rootSchema } = require('./graphql/root')
const { scalarSchema } = require('./graphql/scalar')
const { helloSchema } = require('./graphql/hello')
const { userSchema } = require('./graphql/user')
const { graphSchema } = require('./graphql/graph')

const { typeDefs, resolvers } = mergeSchemas({
  schemas: [
    scalarSchema,
    rootSchema,
    helloSchema,
    userSchema,
    graphSchema
  ]
})

const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

function mergeSchemas({ schemas }) {
  return {
    typeDefs: schemas.map(schema => schema.typeDefs),
    resolvers: merge(...schemas.map(schema => schema.resolvers))
  }
}

module.exports = {
  graphqlSchema
}
