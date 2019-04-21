import { ApolloClient } from 'apollo-client'
import { from, split, concat } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'

const wsClient = new SubscriptionClient(
  'ws://localhost:4000/graphql',
  {
    reconnect: true,
    connectionParams: () => {
      return {
        authToken: localStorage.getItem('token')
      }
    }
  }
)

const wsLink = new WebSocketLink(wsClient)

const httpLink = createHttpLink({
  uri: '/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(error => {
      console.error(error)
    })
  }

  if (networkError) {
    console.error(networkError)
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    )
  },
  wsLink,
  concat(authLink, httpLink)
)

export const client = new ApolloClient({
  link: from([
    ...(process.env.NODE_ENV === 'production'
      ? []
      : [errorLink]),
    link
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: true
})
