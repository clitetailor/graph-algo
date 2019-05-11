export function readCamelCase(str) {
  let group = null
  let regexp = /[A-Z]?[a-z]+/g
  let chunks = []

  while ((group = regexp.exec(str)) !== null) {
    chunks.push(group[0].toLowerCase())
  }

  return chunks.join(' ')
}
