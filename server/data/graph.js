const cheerio = require('cheerio')
const format = require('xml-beautifier')

function toGraphML(graph) {
  const $ = cheerio.load(
    `
      <?xml version="1.0" encoding="UTF-8"?>
      <graphml xmlns="http://graphml.graphdrawing.org/xmlns" 
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"
      >
        <graph></graph>
      </graphml>
    `,
    {
      xmlMode: true
    }
  )

  const edgeDefault =
    graph.type === 'UNDIRECTED_GRAPH'
      ? 'undirected'
      : 'directed'

  const $graphml = $('graphml')

  const $graph = $('graph')
  $graph.attr('edgedefault', edgeDefault)

  const nodeMap = {}
  const edgeMap = {}

  let attrCounter = 0

  ;(() => {
    const $attr = $('<key></key>')

    attrCounter += 1

    let attrId = `d${attrCounter}`

    $attr.attr('id', attrId)
    $attr.attr('for', 'edge')
    $attr.attr('attr.name', 'weight')
    $attr.attr('attr.type', 'float')

    const $default = $('<default></default>')

    $default.text(1)
    $attr.append($default)

    $attr.insertBefore($graph)
  })()

  graph.nodeAttributes.forEach(nodeAttribute => {
    const $attr = $('<key></key>')

    attrCounter += 1

    let attrId = `d${attrCounter}`

    $attr.attr('id', attrId)
    $attr.attr('for', 'node')
    $attr.attr('attr.name', nodeAttribute.name)
    $attr.attr('attr.type', nodeAttribute.type)

    const $default = $('<default></default>')

    if (nodeAttribute.defaultValue) {
      const $default = $('<default></default>')

      $default.text(nodeAttribute.defaultValue)
      $attr.append($default)
    }

    $attr.insertBefore($graph)

    nodeMap[nodeAttribute.name] = attrId
  })

  graph.edgeAttributes.forEach((edgeAttribute, i) => {
    const $attr = $('<key></key>')

    attrCounter += 1

    let attrId = `d${attrCounter}`

    $attr.attr('id', attrId)
    $attr.attr('for', 'edge')
    $attr.attr('attr.name', edgeAttribute.name)
    $attr.attr('attr.type', edgeAttribute.type)

    if (edgeAttribute.defaultValue) {
      const $default = $('<default></default>')

      $default.text(edgeAttribute.defaultValue)
      $attr.append($default)
    }

    $attr.insertBefore($graph)

    edgeMap[edgeAttribute.name] = attrId
  })

  graph.nodes.forEach(node => {
    const $node = $('<node></node>')

    $node.attr('id', `n${node.id}`)

    $graph.append($node)

    graph.nodeAttributes.forEach(nodeAttribute => {
      const attr = node.meta.find(
        a => a.name === nodeAttribute.name
      )

      if (attr) {
        const $data = $('<data></data>')

        $data.attr('key', nodeMap[attr.name])
        $data.text(attr.value)

        $node.append($data)
      }
    })
  })

  graph.edges.forEach((edge, i) => {
    const $edge = $('<edge></edge>')

    $edge.attr('id', `e${i}`)
    $edge.attr('source', `n${edge.sourceId}`)
    $edge.attr('target', `n${edge.targetId}`)

    $graph.append($edge)

    graph.edgeAttributes.forEach(edgeAttribute => {
      const attr = edge.meta.find(
        a => a.name === edgeAttribute.name
      )

      if (attr) {
        const $data = $('<data></data>')

        $data.attr('key', edgeMap[attr.name])
        $data.text(attr.value)

        $edge.append($data)
      }
    })
  })

  const xml = format($.xml())

  return xml
}

function fromGraphML(graphml) {
  const $ = cheerio.load(graphml, {
    xmlNode: true
  })

  const $graphml = $('graphml')
  const $graph = $('graph')
  const $keys = $('key')
  const $nodes = $('node')
  const $edges = $('edge')

  const type =
    $graph.attr('type') === 'undirected'
      ? 'UNDIRECTED_GRAPH'
      : 'DIRECTED_GRAPH'

  const nodeAttrMap = {}
  const edgeAttrMap = {}

  const nodeAttributes = $keys
    .filter('[for=node]')
    .map((i, el) => {
      const $key = $(el)

      const defaultValue = $('default', $key).text()

      nodeAttrMap[$key.attr('id')] = $key.attr('attr.name')

      return {
        type: $key.attr('attr.type'),
        name: $key.attr('attr.name'),
        ...(defaultValue
          ? {
              defaultValue
            }
          : {})
      }
    })
    .get()

  const edgeAttributes = $keys
    .filter('[for=edge]')
    .map((i, el) => {
      const $key = $(el)

      const defaultValue = $('default', $key).text()

      edgeAttrMap[$key.attr('id')] = $key.attr('attr.name')

      return {
        type: $key.attr('attr.type'),
        name: $key.attr('attr.name'),
        ...(defaultValue
          ? {
              defaultValue
            }
          : {})
      }
    })
    .get()

  const nodes = $nodes
    .map((i, el) => {
      const $node = $(el)

      return {
        id: $node.attr('id').match(/([0-9]+)/)[0],
        meta: $('data', $node)
          .map((i, el) => {
            const $data = $(el)

            return {
              name: nodeAttrMap[$data.attr('key')],
              value: $data.text()
            }
          })
          .get()
      }
    })
    .get()

  const edges = $edges
    .map((i, el) => {
      const $edge = $(el)

      const meta = $('data', $edge)
        .map((i, el) => {
          const $data = $(el)

          return {
            name: edgeAttrMap[$data.attr('key')],
            value: $data.text()
          }
        })
        .get()

      const weightAttr = meta.find(
        attr => attr.name === 'weight'
      )
      const weight = (weightAttr && weightAttr.value) || 1

      return {
        sourceId: $edge.attr('source').match(/([0-9]+)/)[0],
        targetId: $edge.attr('target').match(/([0-9]+)/)[0],
        weight,
        meta: meta.filter(attr => attr.name !== 'weight')
      }
    })
    .get()

  const graph = {
    type,
    nodeAttributes,
    edgeAttributes,
    nodes,
    edges
  }

  return graph
}

module.exports = {
  toGraphML,
  fromGraphML
}
