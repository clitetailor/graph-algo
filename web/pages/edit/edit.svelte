<div class="c-edit">
  <div class="c-edit__toolbar">
    <Toolbar bind:mode="{mode}"></Toolbar>
  </div>

  <div class="c-edit__main">
    <GraphNetwork
      mode="{mode}"
      bind:mode="{mode}"
      bind:this="{graphViewer}"
      bind:graph="{graph}"
      onSvgClick="{onSvgClick}"
      onNodeClick="{onNodeClick}"
      onEdgeClick="{onEdgeClick}"
    ></GraphNetwork>
    <div class="c-edit__menu">
      <Menu
        onBack="{onBack}"
        onSave="{onSave}"
        onDownload="{onDownload}"
        onUpload="{onUpload}"
      ></Menu>
    </div>
  </div>

  <div class="c-edit__sidebar">
    <Sidebar
      bind:this="{sidebar}"
      bind:graph="{graph}"
    ></Sidebar>
  </div>
</div>

<style>
  .c-edit {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: 100%;
  }

  .c-edit__toolbar {
    flex: 0 0 auto;
  }

  .c-edit__main {
    flex: auto;
    overflow: hidden;
    position: relative;
    background: hsl(0, 0%, 90%);
  }

  .c-edit__menu {
    position: absolute;
    right: 0;
    top: 0;
  }

  .c-edit__sidebar {
    flex: 0 auto;
    width: 300px;
  }
</style>

<script>
  import { onMount, tick } from 'svelte'

  import Toolbar from './toolbar.svelte'
  import Sidebar from './sidebar.svelte'
  import Menu from './menu.svelte'
  import GraphNetwork from '../shared/graph-network/graph-network.svelte'

  import {
    createGraph,
    removeGraph,
    loadGraph,
    updateGraph,
    graphAdded,
    graphRemoved,
    graphUpdated
  } from '../../graphql/graph'
  import {
    updateSearchParams,
    getSearchParams
  } from '../../utils/location'
  import { usePage } from '../../utils/page'
  import { Mode } from '../shared/graph-network/graph-network.svelte'
  import {
    UndirectedGraph,
    DirectedGraph,
    GraphType
  } from '../../data/graph'
  import { downloadGraphML } from '../../ajax/download'
  import { uploadGraphML } from '../../ajax/upload'
  import { interval } from '../../utils/time'

  let sidebar
  let graphViewer
  let mode = Mode.SELECT
  let graph = new UndirectedGraph()

  const page = usePage()

  interval(() => {
    onSave()
  }, 60 * 1000)

  onMount(async () => {
    const params = getSearchParams()

    if (params.id) {
      const loadedGraph = await loadGraph(params.id)

      if (loadedGraph.type === GraphType.UNDIRECTED_GRAPH) {
        graph = UndirectedGraph.fromJSON(loadedGraph)
      } else {
        graph = DirectedGraph.fromJSON(loadedGraph)
      }
    } else if (params.type === 'undirected-graph') {
      await tick()
      graph = new UndirectedGraph()
    } else {
      await tick()
      graph = new DirectedGraph()
    }
    
    graphViewer.restartSimulation()
  })

  function onBack() {
    page('/dashboard')
  }

  async function onSave() {
    try {
      const params = getSearchParams()

      if (params.id) {
        await updateGraph(params.id, graph.toJSON())
      } else {
        const result = await createGraph(graph.toJSON())

        updateSearchParams({ id: result.id })
      }
    } catch (error) {
      throw error
    }
  }

  function onDownload() {
    downloadGraphML(graph.toJSON())
  }

  function onUpload(event) {
    const reader = new FileReader()

    const file =
      event.target &&
      event.target.files &&
      event.target.files[0]

    reader.onload = async readerEvent => {
      const graphml = readerEvent.target.result

      let loadedGraph = await uploadGraphML(graphml)

      if (loadedGraph.type === GraphType.UNDIRECTED_GRAPH) {
        graph = UndirectedGraph.fromJSON(loadedGraph)
      } else {
        graph = DirectedGraph.fromJSON(loadedGraph)
      }

    }
    graphViewer.restartSimulation()

    if (file) {
      const graphml = reader.readAsText(file)
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
