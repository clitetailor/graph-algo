import gql from 'graphql-tag'

import { client } from './client'

export async function signup(username, password) {
  const payload = await client.mutate({
    mutation: gql`
      mutation Signup($username: String!, $password: String!) {
        signup(username: $username, password: $password) {
          token
        }
      }
    `,
    variables: {
      username,
      password
    }
  })

  localStorage.setItem('token', payload.data.signup.token)
  await client.resetStore()

  return payload.data.signup
}

export async function login(username, password) {
  const payload = await client.mutate({
    mutation: gql`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
        }
      }
    `,
    variables: {
      username,
      password
    }
  })

  localStorage.setItem('token', payload.data.login.token)
  await client.resetStore()

  return payload.data.login
}

export async function checkAuth() {
  const payload = await client.mutate({
    mutation: gql`
      mutation CheckAuth {
        checkAuth {
          ok
        }
      }
    `
  })

  return payload.data.checkAuth
}

export function logout() {
  localStorage.removeItem('token')
}
