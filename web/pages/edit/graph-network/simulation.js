import * as d3 from 'd3'

export function createSimulation({ width, height, radius }) {
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
              Math.abs(edge.target.count - edge.source.count) +
                1,
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
