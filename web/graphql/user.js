import gql from 'graphql-tag'

import { client } from './client'

export async function getCurrentUser() {
  const payload = await client.query({
    query: gql`
      query GetCurrentUser {
        user {
          username
          password
        }
      }
    `
  })

  return payload.data.user
}
