import { client } from './client'
import gql from 'graphql-tag'

export async function getGraphInfos() {
  const payload = await client.query({
    query: gql`
      query GetGraphInfos {
        graphInfos {
          id
          useId
          title
          nodeCount
          edgeCount
        }
      }
    `
  })

  return payload.data.graphInfos
}

export async function loadGraph(id) {
  const payload = await client.query({
    query: gql`
      query LoadGraph($id: ID) {
        graph(id: $id) {
          id
          userId
          title
          nodes {
            id
            x
            y
          }
          edges {
            sourceId
            targetId
          }
          nodeCount
          edgeCount
        }
      }
    `,
    variables: {
      id
    }
  })

  return payload.data.graph
}

export async function createGraph(graph) {
  const payload = await client.mutate({
    mutation: gql`
      mutation CreateGraph($graph: GraphInput) {
        createGraph(graph: $graph) {
          id
        }
      }
    `,
    variables: {
      graph
    }
  })

  return payload.data.createGraph
}

export async function updateGraph(id, graph) {
  const payload = await client.mutate({
    mutation: gql`
      mutation UpdateGraph($id: ID, $graph: GraphInput) {
        updateGraph(id: $id, graph: $graph) {
          id
        }
      }
    `,
    variables: {
      id,
      graph
    }
  })

  return payload.data.updateGraph
}

export async function removeGraph(id) {
  const payload = await client.mutate({
    mutation: gql`
      mutation RemoveGraph($id: ID) {
        removeGraph(id: $id) {
          id
        }
      }
    `,
    variables: {
      id
    }
  })

  return payload.data.removeGraph
}

export function graphAdded() {
  return client
    .subscribe({
      query: gql`
        subscription GraphAdded {
          graphAdded {
            id
            title
            nodeCount
            edgeCount
            createdAt
          }
        }
      `
    })
    .map(payload => {
      return payload.data.graphAdded
    })
}

export function graphRemoved() {
  return client
    .subscribe({
      query: gql`
        subscription GraphRemoved {
          graphRemoved {
            id
          }
        }
      `
    })
    .map(payload => {
      return payload.data.graphRemoved
    })
}

export function graphUpdated() {
  return client.subscribe({
    query: gql`
      subscription GraphUpdated {
        graphUpdated {
          id
          title
          nodeCount
          edgeCount
          createAt
        }
      }
    `
  })
}
