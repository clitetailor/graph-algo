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
            60 *
              Math.sqrt(
                (edge.source.edgeCount +
                  edge.target.edgeCount) /
                  2
              ) +
            (edge.source.radius || radius) +
            (edge.target.radius || radius)

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
    .force(
      'collide',
      d3.forceCollide(node => {
        return node.radius || radius
      })
    )

  return simulation
}

export function updateSimulation(simulation, graph) {
  simulation.nodes(graph.nodes)
  simulation.force('link').links(graph.edges)
  simulation.alpha(1)
  simulation.restart()
}
