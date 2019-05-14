<div class="c-edit">
  <div class="c-edit__toolbar">
    <Toolbar onModeChange="{setMode}"></Toolbar>
  </div>

  <div class="c-edit__main">
    <GraphNetwork
      mode="{mode}"
      bind:this="{graphViewer}"
      onSvgClick="{onSvgClick}"
      onNodeClick="{onNodeClick}"
      onEdgeClick="{onEdgeClick}"
      onUpdate="{onGraphUpdate}"
    ></GraphNetwork>
    <div class="c-edit__menu">
      <Menu onBack="{onBack}" onSave="{onSave}"></Menu>
    </div>
  </div>

  <div class="c-edit__sidebar">
    <Sidebar
      bind:this="{sidebar}"
      onUpdate="{onSidebarUpdate}"
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
  import { onMount } from 'svelte'

  import Toolbar from './toolbar.svelte'
  import Sidebar from './sidebar.svelte'
  import Menu from './menu.svelte'
  import GraphNetwork from './graph-network/graph-network.svelte'

  import { loadSvgImage } from '../../ajax/image'
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
  import { requireAuth, usePage } from '../../utils/page'
  import { Mode } from './graph-network/graph-network.svelte'
  import {
    UndirectedGraph,
    DirectedGraph,
    GraphType
  } from '../../data/graph'

  let graphViewer
  let sidebar
  let mode = Mode.SELECT

  const page = usePage()

  onMount(async () => {
    const params = getSearchParams()

    if (params.id) {
      const graph = await loadGraph(params.id)

      sidebar.setTitle(graph.title)

      if (graph.type === GraphType.UNDIRECTED_GRAPH) {
        setGraph(UndirectedGraph.fromJSON(graph))
      } else {
        setGraph(DirectedGraph.fromJSON(graph))
      }
    } else if (params.type === 'undirected-graph') {
      setGraph(new UndirectedGraph())
    } else {
      setGraph(new DirectedGraph())
    }
  })

  function setGraph(graph) {
    graphViewer.setGraph(graph)
    sidebar.setGraph(graph)
  }

  function setMode(newMode) {
    mode = newMode
  }

  function onBack() {
    page('/dashboard')
  }

  async function onSave() {
    const title = sidebar.getTitle()
    const graph = graphViewer.getGraph().toJSON()

    try {
      const params = getSearchParams()

      if (params.id) {
        await updateGraph(params.id, {
          title,
          ...graph
        })
      } else {
        const result = await createGraph({
          title,
          ...graph
        })

        updateSearchParams({ id: result.id })
      }
    } catch (error) {
      throw error
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

  function onGraphUpdate() {
    sidebar.update()
  }

  function onSidebarUpdate() {
    graphViewer.update()
  }
</script>
