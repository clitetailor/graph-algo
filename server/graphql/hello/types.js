const typeDefs = /* GraphQL */ `
  type Hello {
    text: String
  }

  extend type Query {
    hello: Hello
  }

  extend type Subscription {
    hello: String
  }
`

module.exports = { typeDefs }
