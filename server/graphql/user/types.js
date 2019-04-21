const typeDefs = /* GraphQL */ `
  type User {
    username: String
    password: String
  }

  type AuthPayload {
    token: String
  }

  type CheckAuthPayload {
    ok: Boolean
  }

  extend type Query {
    user: User
  }

  extend type Mutation {
    login(username: String, password: String): AuthPayload
    signup(username: String, password: String): AuthPayload
    checkAuth: CheckAuthPayload
  }
`

module.exports = { typeDefs }
