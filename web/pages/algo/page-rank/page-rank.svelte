<div class="c-page-rank">
  <div class="c-page-rank__toolbar">
    <Toolbar
      bind:this="{toolbar}"
      bind:mode="{mode}"
      onModeChange="{setMode}"
    ></Toolbar>
  </div>

  <div class="c-page-rank__main">
    <GraphNetwork
      bind:this="{graphViewer}"
      bind:mode="{mode}"
      bind:graph="{graph}"
      onSvgClick="{onSvgClick}"
      onNodeClick="{onNodeClick}"
      onEdgeClick="{onEdgeClick}"
    ></GraphNetwork>
    <div class="c-page-rank__menu">
      <Menu onBack="{onBack}"></Menu>
    </div>
  </div>

  <div class="c-page-rank__sidebar">
    <Sidebar
      bind:this="{sidebar}"
      bind:graph="{graph}"
      restartSimulation="{() => graphViewer.restartSimulation()}"
    ></Sidebar>
  </div>
</div>

<style>
  .c-page-rank {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: 100%;
  }

  .c-page-rank__toolbar {
    flex: 0 0 auto;
  }

  .c-page-rank__main {
    flex: auto;
    overflow: hidden;
    position: relative;
    background: hsl(0, 0%, 90%);
  }

  .c-page-rank__menu {
    position: absolute;
    right: 0;
    top: 0;
  }

  .c-page-rank__sidebar {
    flex: 0 auto;
    width: 300px;
  }
</style>

<script>
  import { onMount } from 'svelte'

  import Toolbar from '../toolbar.svelte'
  import Menu from '../menu.svelte'
  import GraphNetwork from '../../shared/graph-network/graph-network.svelte'
  import Sidebar from './sidebar.svelte'

  import {
    createGraph,
    removeGraph,
    loadGraph,
    updateGraph,
    graphAdded,
    graphRemoved,
    graphUpdated
  } from '../../../graphql/graph'
  import { Mode } from '../../shared/graph-network/graph-network.svelte'
  import {
    updateSearchParams,
    getSearchParams
  } from '../../../utils/location'
  import { usePage } from '../../../utils/page'
  import {
    UndirectedGraph,
    DirectedGraph,
    GraphType
  } from '../../../data/graph'

  const page = usePage()

  let graphViewer
  let sidebar
  let toolbar
  let mode = Mode.SELECT
  let graph = new UndirectedGraph()

  onMount(async () => {
    const params = getSearchParams()

    if (params.id) {
      const loadedGraph = await loadGraph(params.id)

      if (loadedGraph.type === GraphType.UNDIRECTED_GRAPH) {
        graph = UndirectedGraph.fromJSON(loadedGraph)
      } else {
        graph = DirectedGraph.fromJSON(loadedGraph)
      }
    }
  })

  function setMode(newMode) {
    mode = newMode
  }

  function onBack() {
    const params = getSearchParams()

    if (params.id) {
      page(`/edit?id=${params.id}`)
    }
  }

  function onSvgClick(event) {
    sidebar.showDefault()
  }

  function onNodeClick(node) {
    return event => {
      if (mode === Mode.SELECT || mode === Mode.LINE) {
        sidebar.showNode(node)
      }
    }
  }

  function onEdgeClick(edge) {
    return event => {
      if (mode === Mode.SELECT) {
        sidebar.showEdge(edge)
      }
    }
  }
</script>
