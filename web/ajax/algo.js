import axios from 'axios'

export async function processPageRank(inputData) {
  const { dampingFactor, precision, loop, graph } = inputData

  let nodes = graph.nodes.map(node => node.id)
  let edges = graph.edges.map(
    edge => `${edge.sourceId} ${edge.targetId}`
  )

  const payload = await axios({
    url: '/process/pagerank',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: `
      ${dampingFactor}
      ${nodes.length}
      ${nodes.join(' ')}
      ${edges.length}
      ${edges.join('\n')}
      ${precision} ${loop}
    `
  })

  return payload.data
}

export async function processHits(inputData) {
  const { precision, loop, graph } = inputData

  let nodes = graph.nodes.map(node => node.id)
  let edges = graph.edges.map(
    edge => `${edge.sourceId} ${edge.targetId}`
  )

  const payload = await axios({
    url: '/process/hits',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: `
      ${nodes.length}
      ${nodes.join(' ')}
      ${edges.length}
      ${edges.join('\n')}
      ${precision} ${loop}
    `
  })

  return payload.data
}
