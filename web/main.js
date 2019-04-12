import App from './main.html'
import { client } from './graphql/client'

const app = new App({
  target: document.body
})

if (process.env.NODE_ENV === 'development')
  window.__APOLLO_CLIENT__ = client

export default app
