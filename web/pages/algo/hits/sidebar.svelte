<script context="module">
  export const Tab = {
    INFO: 'INFO',
    RESULT: 'RESULT'
  }

  export const InfoSubTab = {
    DEFAULT: 'DEFAULT',
    NODE: 'NODE',
    EDGE: 'EDGE'
  }
</script>

<script>
  import { caculateRadius } from '../draw'
  import { processHits } from '../../../ajax/algo'
  import { UndirectedGraph } from '../../../data/graph'
  import {
    readCamelCase,
    writeCamelCase
  } from '../../../utils/string'

  document.getGraph = () => graph

  let titleInput

  let hitsProcessed = false
  let dampingFactor = 0.75
  let precision = 0.001
  let loop = 10

  export let restartSimulation = function() {}

  let tab = Tab.INFO
  let infoSubTab = InfoSubTab.DEFAULT

  export let graph = new UndirectedGraph()
  let currentNode = null
  let currentEdge = null

  export function update() {
    graph = graph
    currentNode = currentNode
    currentEdge = currentEdge
  }

  export function isInfoTabActive() {
    return tab === Tab.INFO
  }

  export function isDefaultInfoActive() {
    return (
      isInfoTabActive() && infoSubTab === InfoSubTab.DEFAULT
    )
  }

  export function isNodeInfoActive() {
    return isInfoTabActive() && infoSubTab === InfoSubTab.NODE
  }

  export function isEdgeInfoActive() {
    return isInfoTabActive() && infoSubTab === InfoSubTab.EDGE
  }

  export function showDefault() {
    showInfo()
    infoSubTab = InfoSubTab.DEFAULT
  }

  export function showNode(node) {
    showInfo()
    infoSubTab = InfoSubTab.NODE
    currentNode = node
  }

  export function showEdge(edge) {
    showInfo()
    infoSubTab = InfoSubTab.EDGE
    currentEdge = edge
  }

  export function showInfo() {
    tab = Tab.INFO
  }

  export function showResult() {
    tab = Tab.RESULT
  }

  export let onNodeClick = function() {
    return function() {}
  }
  function _onNodeClick(node) {
    return event => {
      onNodeClick(node)(event)
      graph.selectNode(node)

      graph = graph
    }
  }

  function setAttribute(target, attr, value) {
    let formattedValue

    if (attr.editable !== undefined && !attr.editable) {
      return
    }

    try {
      if (attr.type === 'float') {
        formattedValue = parseFloat(value)
      } else if (attr.type === 'int') {
        formattedValue = parseInt(value)
      } else {
        formattedValue = value
      }

      target[attr.name] = formattedValue

      if (attr.name === 'title') {
        update()
      }

      currentNode = currentNode
      currentEdge = currentEdge
    } catch (error) {
      throw error
    }
  }

  function showAttribute(target, attr) {
    const displayValue = target[attr.name]

    if (attr.name === 'sourceId') {
      return target.source.id
    }

    if (attr.name === 'targetId') {
      return target.target.id
    }

    if (attr.type === 'object') {
      return JSON.stringify(displayValue)
    } else if (attr.type === 'string') {
      return displayValue || attr.defaultValue || ''
    } else {
      return displayValue || attr.defaultValue
    }
  }

  export async function triggerHits() {
    const data = {
      precision,
      loop,
      graph: graph.toJSON()
    }

    const result = await processHits(data)

    hitsProcessed = true

    const hubSum = result.hubs.data.reduce((a, b) => a + b, 0)
    const authSum = result.auth.data.reduce((a, b) => a + b, 0)

    graph.nodes.forEach((node, i) => {
      if (result.hubs.data[i] > 0) {
        const portion = result.hubs.data[i] / hubSum

        node.radius = caculateRadius(portion, 30, 80)
        node.isHub = true
        node.percentage = (portion * 100).toFixed(2)
      }

      if (result.auth.data[i] > 0) {
        const portion = result.auth.data[i] / authSum

        node.radius = caculateRadius(portion, 30, 80)
        node.isAuth = true
        node.percentage = (portion * 100).toFixed(2)
      }
    })
    graph = graph
    restartSimulation()
  }
</script>

<style>
  .c-sidebar {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    border-left: 1px solid hsl(0, 0%, 80%);
  }

  .c-sidebar__header {
    display: flex;
    flex-flow: row nowrap;
    padding: 20px;
  }

  .c-sidebar__title {
    flex: auto;
    padding: 0px;
    outline: none;
    border: none;
    box-shadow: none;
    color: hsl(0, 0%, 40%);
    font-size: 18px;
    font-weight: bold;
  }

  .c-field {
    display: flex;
    margin-bottom: 5px;
  }

  .c-field--button {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }

  .c-field__label {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    align-self: stretch;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: hsl(0, 0%, 60%);
    word-wrap: break-word;
  }

  .c-field__input {
    margin-left: 10px;
    flex: 1 0 0;
    width: 0;
  }

  .c-field__input input {
    max-width: 100%;
  }

  .c-group {
    margin-bottom: 30px;
  }

  .c-group__title {
    margin-bottom: 15px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: hsl(0, 0%, 40%);
  }

  table.c-table {
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
  }

  table.c-table,
  .c-table th,
  .c-table td {
    border: 1px solid hsl(0, 0%, 80%);
    border-collapse: collapse;
  }

  .c-table th,
  .c-table td {
    padding: 8px;
    text-align: left;
  }

  table.c-table tr {
    cursor: pointer;
  }

  table.c-table tr:nth-child(even) {
    background-color: hsl(0, 0%, 90%);
  }

  table.c-table tr:nth-child(odd) {
    background-color: hsl(0, 0%, 100%);
  }

  table.c-table th {
    background-color: black;
    color: white;
  }
</style>

<div class="c-sidebar">
  <div class="c-sidebar__header">
    <input
      class="c-sidebar__title"
      type="text"
      bind:value={graph.title}
      bind:this={titleInput}
      readonly="true" />
  </div>

  <div class="c-sidebar__tabs o-tabs">
    {#if !hitsProcessed}
      <div class="o-tabs__panel">
        <div class="c-group">
          <div class="c-group__title">input data</div>
          <div class="c-group__list">
            <div class="c-field">
              <div class="c-field__label">precision</div>
              <div class="c-field__input">
                <input
                  type="text"
                  class="c-input o-input"
                  bind:value={precision} />
              </div>
            </div>

            <div class="c-field">
              <div class="c-field__label">loop</div>
              <div class="c-field__input">
                <input
                  type="text"
                  class="c-input o-input"
                  bind:value={loop} />
              </div>
            </div>

            <div class="c-field c-field--button">
              <button
                class="o-button o-button--active"
                on:click={triggerHits}>
                Process
              </button>
            </div>
          </div>
        </div>
      </div>
    {:else if isDefaultInfoActive()}
      <div class="o-tabs__panel">
        <div class="c-group">
          <div class="c-group__title">hubs</div>
          <div class="c-group__list">
            <table class="c-table">
              <tr>
                <th>Rank</th>
                <th>Title</th>
                <th>Percentage</th>
              </tr>
              {#each graph.nodes
                .filter(node => node.isHub)
                .sort(
                  (a, b) => b.percentage - a.percentage
                ) as node, i}
                <tr on:click={_onNodeClick(node)}>
                  <td>{i + 1}</td>
                  <td>{node.title || node.id}</td>
                  <td>{node.percentage}%</td>
                </tr>
              {/each}
            </table>
          </div>
        </div>

        <div class="c-group">
          <div class="c-group__title">auths</div>
          <div class="c-group__list">
            <table class="c-table">
              <tr>
                <th>Rank</th>
                <th>Title</th>
                <th>Percentage</th>
              </tr>
              {#each graph.nodes
                .filter(node => node.isAuth)
                .sort(
                  (a, b) => b.percentage - a.percentage
                ) as node, i}
                <tr on:click={onNodeClick(node)}>
                  <td>{i + 1}</td>
                  <td>{node.title || node.id}</td>
                  <td>{node.percentage}%</td>
                </tr>
              {/each}
            </table>
          </div>
        </div>
      </div>
    {:else if isNodeInfoActive()}
      <div class="o-tabs__panel">
        <div class="c-group">
          <div class="c-group__title">
            node origin attributes
          </div>
          <div class="c-group__list">
            {#if currentNode}
              {#each graph.nodeReservedAttributes as attr}
                {#if !attr.hidden}
                  <div class="c-field">
                    <div class="c-field__label">
                       {readCamelCase(attr.name)}
                    </div>
                    <div class="c-field__input">
                      <input
                        type="text"
                        class="o-input c-input"
                        class:is-not-editable={attr.editable !== undefined && !attr.editable}
                        d-value={showAttribute(currentNode, attr)}
                        value={showAttribute(currentNode, attr)}
                        on:change={event => setAttribute(currentNode, attr, event.target.value)} />
                    </div>
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
        </div>

        <div class="c-group">
          <div class="c-group__title">
            node custom attributes
          </div>
          <div class="c-group__list">
            {#if currentNode}
              {#each graph.nodeAttributes as attr}
                {#if !attr.hidden}
                  <div class="c-field">
                    <div class="c-field__label">
                       {readCamelCase(attr.name)}
                    </div>
                    <div class="c-field__input">
                      <input
                        type="text"
                        class="o-input c-input"
                        class:is-not-editable={attr.editable !== undefined && !attr.editable}
                        value={showAttribute(currentNode, attr)}
                        on:change={event => setAttribute(currentNode, attr, event.target.value)} />
                    </div>
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {:else if isEdgeInfoActive()}
      <div class="o-tabs__panel">
        <div class="c-group">
          <div class="c-group__title">
            edge origin attributes
          </div>
          <div class="c-group__list">
            {#if currentEdge}
              {#each graph.edgeReservedAttributes as attr}
                {#if !attr.hidden}
                  <div class="c-field">
                    <div class="c-field__label">
                       {readCamelCase(attr.name)}
                    </div>
                    <div class="c-field__input">
                      <input
                        type="text"
                        class="o-input c-input"
                        class:is-not-editable={attr.editable !== undefined && !attr.editable}
                        d-value={showAttribute(currentEdge, attr)}
                        value={showAttribute(currentEdge, attr)}
                        on:change={event => setAttribute(currentEdge, attr, event.target.value)} />
                    </div>
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
        </div>

        <div class="c-group">
          <div class="c-group__title">
            edge custom attributes
          </div>
          <div class="c-group__list">
            {#if currentEdge}
              {#each graph.edgeAttributes as attr}
                {#if !attr.hidden}
                  <div class="c-field">
                    <div class="c-field__label">
                       {readCamelCase(attr.name)}
                    </div>
                    <div class="c-field__input">
                      <input
                        type="text"
                        class="o-input c-input"
                        class:is-not-editable={attr.editable !== undefined && !attr.editable}
                        d-value={showAttribute(currentEdge, attr)}
                        value={showAttribute(currentEdge, attr)}
                        on:change={event => setAttribute(currentEdge, attr, event.target.value)} />
                    </div>
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="o-tabs__panel" />
    {/if}
  </div>
</div>
