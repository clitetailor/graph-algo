<div class="c-group">
  <div class="c-group__title">Create New Graph</div>
  <div class="c-group__content c-grid">
    <div
      class="c-grid__item c-card is-orange"
      on:click="{createUndirectedGraph}"
    >
      <div class="c-card__icon">
        <i class="material-icons">add</i>
      </div>
      <div class="c-card__title">
        Undirected Graph
      </div>
    </div>

    <div
      class="c-grid__item c-card is-purple"
      on:click="{createDirectedGraph}"
    >
      <div class="c-card__icon">
        <i class="material-icons">add</i>
      </div>
      <div class="c-card__title">
        Directed Graph
      </div>
    </div>
  </div>
</div>

<style>
  .c-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 15px;
  }

  .c-grid__item {
    height: 200px;
  }

  .c-card {
    padding: 20px;
    border: 1px solid hsl(0, 0%, 80%);
    color: hsl(0, 0%, 80%);
    border-radius: 5px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .c-card__icon {
    margin-top: 20px;
    font-weight: bold;
  }

  .c-card__title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    font-weight: bold;
  }

  .c-card.is-purple:hover {
    border: 1px solid hsl(261, 100%, 50%);
    color: hsl(261, 100%, 50%);
  }

  .c-card.is-orange:hover {
    border: 1px solid hsl(28, 100%, 50%);
    color: hsl(28, 100%, 50%);
  }
</style>

<script>
  import { usePage } from '../../utils/page'

  const page = usePage()

  export function createDirectedGraph() {
    page('/edit?type=directed-graph')
  }

  export function createUndirectedGraph() {
    page('/edit?type=undirected-graph')
  }
</script>
