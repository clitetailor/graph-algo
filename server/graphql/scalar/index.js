const { anyResolvers } = require('./any')
const { dateResolvers } = require('./date')
const { typeDefs } = require('./types')

const resolvers = {
  ...dateResolvers,
  ...anyResolvers
}

const scalarSchema = {
  resolvers,
  typeDefs
}

module.exports = {
  scalarSchema
}
