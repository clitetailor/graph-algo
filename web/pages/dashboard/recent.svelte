<div class="c-group">
  <div class="c-group__title">Recents</div>
  <div class="c-group__content c-list">
    {#each graphInfos as graphInfo}
      <div class="c-list__item">
        <div
          class="c-list__item__icon"
          class:is-orange={graphInfo.type === GraphType.UNDIRECTED_GRAPH}
          class:is-purple={graphInfo.type === GraphType.DIRECTED_GRAPH}>
          <SvgImg src="/images/dashboard/graph.svg" />
        </div>
        <div class="c-list__item__content">
          <div class="c-list__item__title">
            {graphInfo.title}
          </div>
          <div class="c-list__item__description">
            <div>Nodes: {graphInfo.nodeCount}</div>
            <div>Edges: {graphInfo.edgeCount}</div>
          </div>
          <div
            class="c-list__item__action"
            on:click={() => page(`/edit?id=${graphInfo.id}`)}>
            Go To
            <i
              class="material-icons c-list__item__action__icon">
              arrow_forward
            </i>
          </div>
        </div>
        <div
          class="c-list__item__menu"
          on:click={() => removeGraph(graphInfo.id)}>
          <i class="material-icons">close</i>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .c-list {
    height: 400px;
    overflow-y: auto;
    border-top: 1px solid hsl(0, 0%, 80%);
    border-bottom: 1px solid hsl(0, 0%, 80%);
  }

  .c-list__item {
    border-bottom: 1px solid hsl(0, 0%, 80%);
    display: flex;
    align-items: stretch;
  }

  .c-list__item__icon {
    flex: 0 0 auto;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .c-list__item__icon :global(svg) {
    width: 32px;
    height: 32px;
  }

  .c-list__item__icon.is-purple :global(svg path) {
    fill: hsl(261, 100%, 50%);
  }

  .c-list__item__icon.is-orange :global(svg path) {
    fill: hsl(28, 100%, 50%);
  }

  .c-list__item__content {
    flex: 1 0 auto;
    padding: 15px;
  }

  .c-list__item__title {
    margin-bottom: 15px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: hsl(0, 0%, 20%);
  }

  .c-list__item__description {
    margin-bottom: 15px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: hsl(0, 0%, 40%);
  }

  .c-list__item:last-child {
    margin-bottom: -1px;
  }

  .c-list__item__menu {
    padding: 20px;
    color: hsl(0, 0%, 60%);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .c-list__item__menu:hover {
    color: hsl(0, 0%, 20%);
  }

  .c-list__item__action {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: hsl(0, 0%, 20%);
    cursor: pointer;
  }

  .c-list__item__action__icon {
    transition: 0.2s ease-in-out;
    font-size: 22px;
    transform: translate(2px, 6px);
  }

  .c-list__item__action:hover .c-list__item__action__icon {
    transform: translate(10px, 6px);
  }
</style>

<script>
  import { onMount, onDestroy } from 'svelte'

  import SvgImg from '../shared/svg-img.svelte'

  import { GraphType } from '../../data/graph'
  import {
    getGraphInfos,
    removeGraph,
    graphAdded,
    graphRemoved
  } from '../../graphql/graph'
  import { usePage } from '../../utils/page'

  const page = usePage()

  let graphInfos = []

  const subscriptions = {}

  onMount(async () => {
    graphInfos = await getGraphInfos()

    subscriptions.graphAdded = graphAdded().subscribe(g => {
      graphInfos.unshift(g)
      graphInfos = graphInfos
    })

    subscriptions.graphRemoved = graphRemoved().subscribe(g => {
      graphInfos = graphInfos.filter(graph => graph.id !== g.id)
    })
  })

  onDestroy(() => {
    subscriptions.graphAdded.unsubscribe()
    subscriptions.graphRemoved.unsubscribe()
  })
</script>
