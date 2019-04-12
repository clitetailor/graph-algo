import * as d3 from 'd3'

export function createSimulation({ width, height, radius }) {
  const simulation = d3
    .forceSimulation()
    .velocityDecay(0.8)
    .force(
      'link',
      d3
        .forceLink()
        .distance(200)
        .id(d => d.id)
    )
    .force(
      'charge',
      d3
        .forceManyBody()
        .strength(-400)
        .distanceMax(100)
    )
    .force('collide', d3.forceCollide(radius))

  return simulation
}
