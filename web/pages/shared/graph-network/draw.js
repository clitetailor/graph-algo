export function edgeId(edge) {
  return `${edge.source.id}-${edge.target.id}`
}

export function drawLine(edge, radius) {
  const source = {}
  const target = {}

  const distVec = {
    x: edge.target.x - edge.source.x,
    y: edge.target.y - edge.source.y
  }
  const normVec = normalize(distVec)

  source.x =
    edge.source.x + normVec.x * (edge.source.radius || radius)
  source.y =
    edge.source.y + normVec.y * (edge.source.radius || radius)

  target.x =
    edge.target.x - normVec.x * (edge.target.radius || radius)
  target.y =
    edge.target.y - normVec.y * (edge.target.radius || radius)

  return `
    M ${source.x} ${source.y}
    L ${target.x} ${target.y}
  `
}

export function lineCenter(edge) {
  return {
    x: (edge.source.x + edge.target.x) / 2,
    y: (edge.source.y + edge.target.y) / 2
  }
}

export function curveCenter(start, mid, end) {
  return {
    x: start.x / 4 + mid.x / 2 + end.x / 4,
    y: start.y / 4 + mid.y / 2 + end.y / 4
  }
}

export function caculateCurve(edge, radius) {
  const source = {}
  const mid = {}
  const target = {}

  const normVec = normalize({
    x: edge.target.x - edge.source.x,
    y: edge.target.y - edge.source.y
  })

  const multipliedLeftRadius = multiply(
    normVec,
    edge.source.radius || radius
  )
  const multipliedRightRadius = multiply(
    normVec,
    edge.target.radius || radius
  )
  const leftRadian = rotate(multipliedLeftRadius, 20)
  const rightRadian = rotate(multipliedRightRadius, 160)

  source.x = edge.source.x + leftRadian.x
  source.y = edge.source.y + leftRadian.y

  target.x = edge.target.x + rightRadian.x
  target.y = edge.target.y + rightRadian.y

  const prepVec = rotate(
    multiply(
      {
        x:
          (multipliedLeftRadius.x + multipliedRightRadius.x) /
          2,
        y:
          (multipliedLeftRadius.y + multipliedRightRadius.y) / 2
      },
      1.5
    ),
    90
  )

  mid.x = (source.x + target.x) / 2 + prepVec.x
  mid.y = (source.y + target.y) / 2 + prepVec.y

  return {
    source,
    mid,
    target
  }
}

export function caculateHitsNodeBackground(node) {
  if (node.isAuth) {
    return 'hsl(158, 100%, 50%)'
  }

  if (node.isHub) {
    return 'hsl(201, 100%, 50%)'
  }
}

export function multiply(vec, number) {
  return {
    x: vec.x * number,
    y: vec.y * number
  }
}

export function rotate(vec, angle) {
  const radian = (angle / 180) * Math.PI
  return {
    x: vec.x * Math.cos(radian) - vec.y * Math.sin(radian),
    y: vec.x * Math.sin(radian) + vec.y * Math.cos(radian)
  }
}

export function normalize(vec) {
  const dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y)

  return {
    x: vec.x / dist,
    y: vec.y / dist
  }
}
