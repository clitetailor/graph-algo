const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const dateResolvers = {
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

module.exports = {
  dateResolvers
}
