<div class="c-sidebar">
  <div class="c-sidebar__header">
    <input
      class="c-sidebar__title"
      type="text"
      bind:value="{title}"
      bind:this="{titleInput}"
    />
    <i class="material-icons" on:click="{() => focusTitle()}">
      edit
    </i>
  </div>

  <div class="c-sidebar__tabs o-tabs">
    <div class="o-tabs__tab-bar">
      <div
        class="o-tabs__tab"
        class:is-active="{tab === Tab.INFO}"
        on:click="{() => showInfo()}"
      >
        <div class="o-tabs__tab-decorator">
          Info
        </div>
      </div>
      <div
        class="o-tabs__tab"
        class:is-active="{tab === Tab.ACTIONS}"
        on:click="{() => showActions()}"
      >
        <div class="o-tabs__tab-decorator">
          Actions
        </div>
      </div>
    </div>

    {#if isDefaultInfoActive()}
    <div class="o-tabs__panel"></div>
    {:else if isNodeInfoActive()}
    <div class="o-tabs__panel">
      <div class="c-group">
        <div class="c-group__title"></div>
        <div class="c-group__list">
          {#if currentNode}
          <!--  -->
          {#each graph.nodeReservedAttributes as attr}
          <!--  -->
          {#if !attr.hidden}
          <div class="c-field">
            <div class="c-field__label">
              {readCamelCase(attr.name)}
            </div>
            <div class="c-field__input">
              <input
                type="text"
                class="o-input c-input"
                class:is-not-editable="{attr.editable !== undefined && !attr.editable}"
                d-value="{showAttribute(currentNode, attr)}"
                value="{showAttribute(currentNode, attr)}"
                on:input="{(event) => setAttribute(currentNode, attr, event.target.value)}"
              />
            </div>
          </div>
          {/if}
          <!--  -->
          {/each}
          <!--  -->
          {/if}
        </div>
      </div>

      <div class="c-group">
        <div class="c-group__title"></div>
        <div class="c-group__list">
          {#if graph.nodeAttributes.length > 0}
          <!--  -->
          {#each graph.nodeAttributes as attr}
          <!--  -->
          {readCamelCase(attr.name)}
          <!--  -->
          {/each}
          <!--  -->
          {/if}
        </div>
      </div>
    </div>
    {:else if isEdgeInfoActive()}
    <div class="o-tabs__panel">
      <div class="c-group">
        <div class="c-group__title"></div>
        <div class="c-group__list">
          {#each graph.edgeReservedAttributes as attr} {/each}
        </div>
      </div>

      <div class="c-group">
        <div class="c-group__title"></div>
        <div class="c-group__list">
          {#if graph.edgeAttributes.length > 0}
          <!--  -->
          {#each graph.edgeAttributes as attr}
          <!--  -->
          {/each}
          <!--  -->
          {/if}
        </div>
      </div>
    </div>
    {:else}
    <div class="o-tabs__panel"></div>
    {/if}
  </div>
</div>

<style>
  .c-sidebar {
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

  .c-sidebar__header i {
    font-size: 18px;
    color: hsl(0, 0%, 40%);
    cursor: pointer;
    user-select: none;
  }

  .c-field {
    display: flex;
    margin-bottom: 5px;
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
</style>

<script context="module">
  export const Tab = {
    INFO: 'INFO',
    ACTIONS: 'ACTIONS'
  }

  export const InfoSubTab = {
    DEFAULT: 'DEFAULT',
    NODE: 'NODE',
    EDGE: 'EDGE'
  }
</script>

<script>
  import { UndirectedGraph } from '../../data/graph'
  import { readCamelCase } from '../../utils/string'

  let title = 'Untitled'
  let titleInput

  let tab = Tab.INFO
  let infoSubTab = InfoSubTab.DEFAULT

  let graph = new UndirectedGraph()
  let currentNode = null
  let currentEdge = null

  export function update() {
    graph = graph
    currentNode = currentNode
    currentEdge = currentEdge
  }

  export function setGraph(newGraph) {
    graph = newGraph
  }

  export function focusTitle() {
    if (titleInput) {
      titleInput.focus()
    }
  }

  export function getTitle() {
    return title
  }

  export function setTitle(t) {
    title = t
  }

  export function isInfoTabActive() {
    return tab === Tab.INFO
  }

  export function isActionsTabActive() {
    return tab === Tab.ACTIONS
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

  export function showActions() {
    tab = Tab.ACTIONS
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

      currentNode = currentNode
      currentEdge = currentEdge
    } catch (error) {
      throw error
    }
  }

  function showAttribute(target, attr) {
    const displayValue = target[attr.name]

    if (attr.type === 'object') {
      return JSON.stringify(displayValue)
    } else if (attr.type === 'string') {
      return displayValue || ''
    } else {
      return displayValue
    }
  }
</script>
