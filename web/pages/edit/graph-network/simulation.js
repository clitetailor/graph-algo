import * as d3 from 'd3'

export function createSimulation(options) {
  const { radius } = options

  const simulation = d3
    .forceSimulation()
    .velocityDecay(0.8)
    .force(
      'link',
      d3
        .forceLink()
        .id(d => d.id)
        .distance(edge => {
          const length =
            200 /
            Math.pow(
              Math.abs(
                edge.target.edgeCount - edge.source.edgeCount
              ) + 1,
              0.3
            )

          return Math.max(length, 100)
        })
    )
    .force(
      'charge',
      d3
        .forceManyBody()
        .strength(-200)
        .distanceMax(100)
    )
    .force('collide', d3.forceCollide(radius * 2))

  return simulation
}

export function updateSimulation(simulation, graph) {
  simulation.nodes(graph.nodes)
  simulation.force('link').links(graph.edges)
  simulation.alpha(1)
  simulation.restart()
}
