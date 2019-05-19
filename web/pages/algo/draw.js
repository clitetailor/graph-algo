export const caculateRadius = (t, innerRadius, outerRadius) => {
  return (1 - t) * innerRadius + t * outerRadius
}
