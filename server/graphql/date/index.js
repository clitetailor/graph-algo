const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const { typeDefs } = require('./types')

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',

    parseValue(value) {
      return new Date(value)
    },

    serialize(value) {
      return value.getTime()
    },

    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10)
      }
      return null
    }
  })
}

const dateSchema = {
  resolvers,
  typeDefs
}

module.exports = {
  dateSchema
}
