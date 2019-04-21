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

async function onConnect(connectionParams) {
  let userId

  const authToken = connectionParams.authToken

  if (authToken) {
    const data = await decodeAuthToken(authToken)

    if (data.userId) {
      userId = data.userId
    }
  }

  return {
    userId
  }
}

module.exports = {
  context,
  onConnect
}
