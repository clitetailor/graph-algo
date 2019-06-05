const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const winston = require('winston')
const history = require('connect-history-api-fallback')
const http = require('http')
const path = require('path')
const proxy = require('express-http-proxy')

const { router } = require('./router')
const { graphqlSchema } = require('./schema')
const { configureLogging } = require('./config/logging')
const { configureDotEnv } = require('./config/dotenv')
const { context, onConnect } = require('./context')

configureLogging()
configureDotEnv()

const app = express()
const httpServer = http.createServer(app)

app.use('/process', proxy('http://localhost:6001'))

app.use(cors())
app.use(bodyParser.text({ limit: '6mb' }))
app.use(bodyParser.json({ limit: '6mb' }))
app.use(
  bodyParser.urlencoded({ extended: false, limit: '6mb' })
)

app.use(router)

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
