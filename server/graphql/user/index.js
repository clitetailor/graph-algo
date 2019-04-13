const { AuthenticationError } = require('apollo-server')

const { generateAuthToken } = require('../../auth')
const { typeDefs } = require('./types')

const resolvers = {
  Mutation: {
    login: async (root, args, context) => {
      const { User } = context
      const { username, password } = args

      const user = await User.findOne({
        where: {
          username,
          password
        }
      })

      if (!user) {
        return new AuthenticationError(
          'Invalid username or password'
        )
      }

      const token = await generateAuthToken({ userId: user.id })

      return { token }
    },

    signup: async (root, args, context) => {
      const { User } = context
      const { username, password } = args

      if (username.match(/^\s*$/)) {
        return new AuthenticationError('Username is required')
      }

      if (password.match(/^\s*$/)) {
        return new AuthenticationError('Password is required')
      }

      const [user, created] = await User.findOrCreate({
        where: { username },
        defaults: {
          username,
          password
        }
      })

      if (!created) {
        return new AuthenticationError(
          'Username already exists'
        )
      }

      const token = await generateAuthToken({ userId: user.id })

      return {
        token
      }
    },

    checkAuth: async (root, args, context) => {
      if (context.userId) {
        return {
          ok: true
        }
      } else {
        return {
          ok: false
        }
      }
    }
  }
}

const userSchema = {
  typeDefs,
  resolvers
}

module.exports = {
  userSchema
}
