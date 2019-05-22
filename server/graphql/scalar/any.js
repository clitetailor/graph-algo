const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const anyResolvers = {
  Any: new GraphQLScalarType({
    name: 'Any',

    parseValue(value) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return value
      }

      return null
    },

    serialize(value) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return value
      }

      return null
    },

    parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
          return JSON.parse(ast.value)

        case Kind.INT:
          return parseInt(ast.value)

        case Kind.FLOAT:
          return parseFloat(ast.value)

        default:
          return null
      }
    }
  })
}

module.exports = {
  anyResolvers
}
