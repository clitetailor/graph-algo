const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const winston = require('winston')
const history = require('connect-history-api-fallback')
const path = require('path')

const { graphqlSchema } = require('./schema')
const { configureLogging } = require('./logging')
const { configureDotEnv } = require('./dotenv')
const { context } = require('./context')

configureLogging()
configureDotEnv()

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const server = new ApolloServer({
  schema: graphqlSchema,
  introspection: true,
  playground: true,
  context
})
server.applyMiddleware({ app })

app.use(history())
app.use(express.static(path.resolve(__dirname, '../public')))

const port = 4000
app.listen(port, () => {
  winston.info(`🚀  Server ready at http://localhost:${port}`)
  winston.info(
    `GraphQL server is available at https://localhost:${port}/graphql`
  )
})
