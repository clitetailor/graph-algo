const { typeDefs } = require('./types')

const timeout = time =>
  new Promise(resolve => setTimeout(() => resolve(true), time))

const resolvers = {
  Query: {
    hello: () => {
      return {
        text: 'Hello, World!'
      }
    }
  },

  Subscription: {
    hello: {
      subscribe: async function*(root, args, context) {
        console.log(context)

        await timeout(1000)
        yield { hello: 'Hello, World!' }
        await timeout(2000)
        yield { hello: 'Good Morning' }
      }
    }
  }
}

const helloSchema = {
  typeDefs,
  resolvers
}

module.exports = {
  helloSchema
}
