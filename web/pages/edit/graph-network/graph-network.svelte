<svg
  bind:this="{svg}"
  width="100%"
  height="100%"
  on:mousedown="{onSvgMouseDown}"
  on:mousewheel="{onSvgMouseWheel}"
  on:click="{_onSvgClick}"
  class="c-graph-network"
>
  <defs>
    <marker
      id="c-graph-network__arrow"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
    <marker
      id="c-graph-network__selected-arrow"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path
        class="c-arrow is-selected"
        d="M 0 0 L 10 5 L 0 10 z"
      />
    </marker>
  </defs>
  <g transform="translate({offsetX}, {offsetY}) scale({scale})">
    <g>
      {#each graph.edges as edge}
      <!--  -->
      {#if edge.bidirect}
      <!--  -->
      {#await caculateCurve(edge, radius) then curve}
      <g
        class="c-edge"
        class:is-selected="{edge.selected}"
        data-source-id="{edge.source.id}"
        data-target-id="{edge.target.id}"
        on:click="{_onEdgeClick(edge)}"
      >
        <path
          d="M {curve.source.x} {curve.source.y} Q {curve.mid.x} {curve.mid.y} {curve.target.x} {curve.target.y}"
          marker-end="{getEdgeMarker(edge)}"
        ></path>
        {#await curveCenter(curve.source, curve.mid,
        curve.target) then center}
        <text
          x="{center.x}"
          y="{center.y}"
          text-anchor="middle"
          alignment-baseline="middle"
        >
          {edge.weight}
        </text>
        {/await}
      </g>
      {/await}
      <!--  -->
      {:else}
      <!--  -->
      {#await lineCenter(edge) then center}
      <g
        class="c-edge"
        class:is-selected="{edge.selected}"
        data-source-id="{edge.source.id}"
        data-target-id="{edge.target.id}"
        on:click="{_onEdgeClick(edge)}"
      >
        <path
          d="{drawLine(edge, radius)}"
          marker-end="{getEdgeMarker(edge)}"
        ></path>
        <text
          x="{center.x}"
          y="{center.y}"
          text-anchor="middle"
          alignment-baseline="middle"
        >
          {edge.weight}
        </text>
      </g>
      {/await}
      <!--  -->
      {/if}
      <!--  -->
      {/each}
    </g>
    <g>
      {#each graph.nodes as node}
      <g
        class="c-node"
        class:is-selected="{node.selected}"
        class:has-title="{node.title}"
        data-node-id="{node.id}"
        on:click="{_onNodeClick(node)}"
        on:mousedown="{onNodeMouseDown(node)}"
      >
        <circle
          cx="{node.x}"
          cy="{node.y}"
          r="{radius}"
        ></circle>
        <text
          x="{node.x}"
          y="{node.y}"
          text-anchor="middle"
          alignment-baseline="middle"
        >
          {node.title || node.id}
        </text>
      </g>
      {/each}
    </g>
  </g>
</svg>

<svelte:window
  on:mouseup="{onWindowMouseUp}"
  on:mousemove="{onWindowMouseMove}"
></svelte:window>

<svelte:options accessors></svelte:options>

<style>
  .c-graph-network {
    user-select: none;
  }

  .c-node circle {
    stroke: black;
    stroke-width: 2px;
    fill: white;
  }

  .c-node text {
    font-family: Arial, Helvetica, sans-serif;
    fill: black;
  }

  .c-node.is-selected circle {
    stroke: hsl(28, 100%, 50%);
  }

  .c-node:hover {
    cursor: pointer;
  }

  .c-node.is-selected text {
    fill: hsl(28, 100%, 50%);
  }

  .c-node.has-title {
    font-size: 12px;
  }

  .c-edge path,
  .c-edge line {
    stroke: black;
    stroke-width: 2px;
    fill: transparent;
  }

  .c-edge text {
    font-family: Arial, Helvetica, sans-serif;
    fill: black;
    font-size: 14px;
    paint-order: stroke;
    stroke-width: 5px;
    stroke: hsl(0, 0%, 90%);
  }

  .c-edge:hover,
  .c-edge:hover {
    cursor: pointer;
  }

  .c-edge.is-selected path,
  .c-edge.is-selected line {
    stroke: hsl(28, 100%, 50%);
  }

  .c-edge.is-selected text {
    fill: hsl(28, 100%, 50%);
  }

  .c-arrow.is-selected {
    fill: hsl(28, 100%, 50%);
  }
</style>

<script context="module">
  export const Mode = {
    SELECT: 'SELECT',
    MOVE: 'MOVE',
    NODE: 'NODE',
    LINE: 'LINE'
  }
</script>

<script>
  import { onMount, onDestroy, beforeUpdate } from 'svelte'

  import {
    createSimulation,
    updateSimulation as _updateSimulation
  } from './simulation'
  import {
    GraphType,
    DirectedGraph,
    UndirectedGraph
  } from '../../../data/graph'
  import {
    drawLine,
    lineCenter,
    curveCenter,
    caculateCurve
  } from './draw'

  let svg
  const radius = 20

  let offsetX = 0
  let offsetY = 0
  let scale = 1

  export let mode = Mode.SELECT
  let currentMode = mode
  let isModeLocked = false
  let isNodeDragging = false
  let draggingNode = undefined
  let isSvgDragging = false

  let graph = new UndirectedGraph()

  let simulation

  onMount(() => {
    setupSimulation()
    setupSvgOffset()
  })

  beforeUpdate(() => {
    updateMode()
  })

  export let onUpdate = function() {}

  export function setGraph(newGraph) {
    graph = newGraph
  }

  export function getGraph() {
    return graph
  }

  function setupSimulation() {
    simulation = createSimulation({
      radius
    })
    updateSimulation()
    simulation.on('tick', () => {
      updateGraph()
    })
  }

  function setupSvgOffset() {
    offsetX = svg.clientWidth / 2
    offsetY = svg.clientHeight / 2
  }

  function updateMode() {
    if (currentMode !== mode) {
      graph.deselectAll()

      currentMode = mode
    }
  }

  function updateSimulation() {
    _updateSimulation(simulation, graph)
  }

  function updateGraph() {
    graph = graph
    onUpdate()
  }

  export function update() {
    graph = graph
  }

  function getEdgeMarker(edge) {
    if (graph.type === GraphType.UNDIRECTED_GRAPH) {
      return undefined
    }

    if (edge.selected) {
      return 'url(#c-graph-network__selected-arrow)'
    }

    return 'url(#c-graph-network__arrow)'
  }

  function getMouseCoordinates(event) {
    const rect = svg.getBoundingClientRect()

    let x = (event.clientX - rect.left - offsetX) / scale
    let y = (event.clientY - rect.top - offsetY) / scale

    return {
      x,
      y
    }
  }

  function onSvgDragStart(event) {
    isSvgDragging = true
    isModeLocked = true
  }

  function onSvgDrag(event) {
    offsetX = offsetX + event.movementX
    offsetY = offsetY + event.movementY
  }

  function onSvgDragEnd(event) {
    isSvgDragging = false
    isModeLocked = false
  }

  function onSvgMouseDown() {
    if (mode === Mode.MOVE) {
      onSvgDragStart(event)
    }
  }

  export let onSvgClick = function() {}
  function _onSvgClick(event) {
    if (
      !event.target.closest('.c-node') &&
      !event.target.closest('.c-edge')
    ) {
      onSvgClick(event)

      graph.deselectAll()
      updateGraph()
    }

    switch (mode) {
      case Mode.NODE:
        if (!event.altKey) {
          const mouseCoordinates = getMouseCoordinates(event)
          graph.createNodeAt(
            mouseCoordinates.x,
            mouseCoordinates.y
          )
          updateSimulation()
          updateGraph()
        }
        break
    }
  }

  function onSvgMouseWheel() {
    const wheelDelta = -event.wheelDelta

    let newScale = scale - wheelDelta / 5000
    if (newScale > 0 && newScale < 2) {
      scale = newScale
    }
  }

  export let onNodeClick = function() {
    return function() {}
  }

  function _onNodeClick(node) {
    return event => {
      onNodeClick(node)(event)

      switch (mode) {
        case Mode.SELECT:
          if (!node.selected) {
            graph.deselectAll()
            graph.selectNode(node)
          } else {
            graph.deselectAll()
          }
          updateGraph()
          break

        case Mode.NODE:
          if (event.altKey) {
            graph.removeNode(node)
            updateSimulation()
          }
          updateGraph()
          break

        case Mode.LINE:
          if (graph.selectedNodes.length === 0) {
            graph.selectNode(node)
          } else {
            const lastSelectedNode = graph.getLastSelectedNode()
            if (lastSelectedNode.id === node.id) {
              graph.deselectAll()
            } else {
              graph.addEdge(lastSelectedNode, node)
              graph.deselectAll()
              updateSimulation()
            }
          }
          updateGraph()
          break
      }
    }
  }

  function onNodeDrag(node) {
    updateSimulation(0.6)

    const mouseCoordinates = getMouseCoordinates(event)

    draggingNode.fx = mouseCoordinates.x
    draggingNode.fy = mouseCoordinates.y

    updateGraph()
  }

  function onNodeDragStart(node) {
    return event => {
      if (mode === Mode.MOVE) {
        event.stopPropagation()
        isNodeDragging = true
        isModeLocked = true
        draggingNode = node

        updateGraph()
      }
    }
  }

  function onNodeDragEnd(node) {
    draggingNode.fx = null
    draggingNode.fy = null
    draggingNode = null

    isNodeDragging = false
    isModeLocked = false

    updateGraph()
  }

  function onNodeMouseDown(node) {
    return onNodeDragStart(node)
  }

  export let onEdgeClick = function() {
    return function() {}
  }

  function _onEdgeClick(edge) {
    return event => {
      onEdgeClick(edge)(event)
      switch (mode) {
        case Mode.SELECT:
          if (!edge.selected) {
            graph.deselectAll()
            graph.selectEdge(edge)
          } else {
            graph.deselectAll()
          }

          updateGraph()
          break

        case Mode.LINE:
          if (event.altKey) {
            graph.removeEdge(edge)
            updateSimulation()

            updateGraph()
          }
          break
      }
    }
  }

  function onWindowMouseUp(event) {
    if (mode === Mode.MOVE) {
      if (isSvgDragging) {
        onSvgDragEnd(event)
      }

      if (isNodeDragging) {
        onNodeDragEnd(event)
      }
    }
  }

  function onWindowMouseMove(event) {
    if (mode === Mode.MOVE && isSvgDragging) {
      onSvgDrag(event)
    }

    if (mode === Mode.MOVE && isNodeDragging) {
      onNodeDrag(event)
    }
  }
</script>
