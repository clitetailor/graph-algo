const { AuthenticationError } = require('apollo-server')
const util = require('util')
const jwt = require('jsonwebtoken')

function generateAuthToken({ userId }) {
  return util.promisify(jwt.sign)(
    { userId },
    process.env.APP_SECRET_KEY,
    {
      algorithm: 'HS256'
    }
  )
}

async function decodeAuthToken(token) {
  const { userId, iat } = await util.promisify(jwt.verify)(
    token,
    process.env.APP_SECRET_KEY,
    {
      algorithm: 'HS256'
    }
  )

  return { userId, iat }
}

async function requireAuth(callback) {
  return (root, args, context, ...rest) => {
    if (!context.userId) {
      return new AuthenticationError('Unauthorization')
    }

    return callback(root, args, context, ...rest)
  }
}

module.exports = {
  generateAuthToken,
  decodeAuthToken
}
