const typeDefs = /* GraphQL */ `
  type AuthPayload {
    token: String
  }

  type CheckAuthPayload {
    ok: Boolean
  }

  extend type Mutation {
    login(username: String, password: String): AuthPayload
    signup(username: String, password: String): AuthPayload
    checkAuth: CheckAuthPayload
  }
`

module.exports = { typeDefs }
