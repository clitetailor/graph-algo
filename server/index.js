const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const winston = require('winston')
const history = require('connect-history-api-fallback')
const http = require('http')
const path = require('path')

const { graphqlSchema } = require('./schema')
const { configureLogging } = require('./config/logging')
const { configureDotEnv } = require('./config/dotenv')
const { context, onConnect } = require('./context')

configureLogging()
configureDotEnv()

const app = express()
const httpServer = http.createServer(app)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const server = new ApolloServer({
  schema: graphqlSchema,
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : { introspection: true, playground: true }),
  context,
  subscriptions: {
    onConnect
  }
})
server.applyMiddleware({ app })

app.use(history())
app.use(express.static(path.resolve(__dirname, '../public')))

server.installSubscriptionHandlers(httpServer)

const port = 4000
httpServer.listen({ port }, () => {
  winston.info(`🚀  Server ready at http://localhost:${port}`)
  winston.info(
    `GraphQL server is available at https://localhost:${port}/graphql`
  )
})
