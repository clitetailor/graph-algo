export function readCamelCase(str) {
  let group = null
  let regexp = /[A-Z]?[a-z]+/g
  let chunks = []

  while ((group = regexp.exec(str)) !== null) {
    chunks.push(group[0].toLowerCase())
  }

  return chunks.join(' ')
}

export function writeCamelCase(str) {
  return str
    .split(/\s+/g)
    .map((chunk, index) =>
      index === 0
        ? chunk
        : chunk[0].toUpperCase() + chunk.substr(1)
    )
    .join('')
}
