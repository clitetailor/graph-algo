const { AuthenticationError } = require('apollo-server')

const db = require('./database')
const { decodeAuthToken } = require('./auth')

async function context({ req, connection }) {
  let userId

  if (connection) {
    return connection.context
  }

  if (req.headers.authorization) {
    try {
      const authToken = req.headers.authorization.split(
        /\s+/
      )[1]

      if (authToken) {
        tokenData = await decodeAuthToken(authToken)

        userId = tokenData.userId
      }
    } catch (error) {}
  }

  return {
    ...db,
    ...(userId ? { userId } : {})
  }
}

module.exports = {
  context
}
