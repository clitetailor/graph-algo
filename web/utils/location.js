export function updateSearchParams(values) {
  const searchParams = new URLSearchParams(location.search)
  const pathname = location.pathname

  for (const key in values) {
    searchParams.set(key, values[key])
  }

  history.pushState(
    {},
    null,
    `${pathname}?${searchParams.toString()}`
  )
}

export function getSearchParams() {
  const searchParams = new URLSearchParams(location.search)
  const data = {}

  for (const key of searchParams.keys()) {
    data[key] = searchParams.get(key)
  }

  return data
}
