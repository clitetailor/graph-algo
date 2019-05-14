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
    <div class="o-tabs__panel">
      <div class="c-group">
        <div class="c-group__title">node custom attributes</div>
        <div class="c-group__list">
          {#each graph.nodeAttributes as attr}
          <div class="c-field">
            <div class="c-field__label">
              {attr.name}
            </div>
            <div
              class="c-field__action"
              on:click="{() => removeNodeAttribute(attr)}"
            >
              <i class="material-icons">close</i>
            </div>
          </div>
          {/each}
        </div>
      </div>

      <div class="c-group">
        <div class="c-group__title">edge custom attributes</div>
        <div class="c-group__list">
          {#each graph.edgeAttributes as attr}
          <div class="c-field">
            <div class="c-field__label">
              {attr.name}
            </div>
            <div
              class="c-field__action"
              on:click="{() => removeEdgeAttribute(attr)}"
            >
              <i class="material-icons">close</i>
            </div>
          </div>
          {/each}
        </div>
      </div>
    </div>
    {:else if isNodeInfoActive()}
    <div class="o-tabs__panel">
      <div class="c-group">
        <div class="c-group__title">node origin attributes</div>
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
        <div class="c-group__title">node custom attributes</div>
        <div class="c-group__list">
          {#if currentNode}
          <!--  -->
          {#each graph.nodeAttributes as attr}
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
        <div class="c-group__title">new custom attribute</div>
        <div class="c-group__list">
          <div class="c-field">
            <div class="c-field__label">name</div>
            <div class="c-field__input">
              <input
                type="text"
                class="o-input c-input"
                bind:value="{newNodeAttribute.name}"
              />
            </div>
          </div>

          <div class="c-field">
            <div class="c-field__label">type</div>
            <div class="c-field__input">
              <select
                type="text"
                class="o-input"
                bind:value="{newNodeAttribute.type}"
              >
                <option value="string">string</option>
                <option value="int">int</option>
                <option value="float">float</option>
              </select>
            </div>
          </div>

          <div class="c-field">
            <div class="c-field__label">default value</div>
            <div class="c-field__input">
              <input
                type="text"
                class="o-input c-input"
                value="{showAttributeDefaultValue(newNodeAttribute)}"
                on:input="{(event) => setAttributeDefaultValue(newNodeAttribute, event.target.value)}"
              />
            </div>
          </div>

          {#if addNodeAttributeErrorMsg}
          <div class="c-field">
            <div class="o-error">
              {addNodeAttributeErrorMsg}
            </div>
          </div>
          {/if}

          <div class="c-field c-field--button">
            <button
              class="o-button o-button--active"
              on:click="{addNodeAttribute}"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
    {:else if isEdgeInfoActive()}
    <div class="o-tabs__panel">
      <div class="c-group">
        <div class="c-group__title">edge origin attributes</div>
        <div class="c-group__list">
          {#if currentEdge}
          <!--  -->
          {#each graph.edgeReservedAttributes as attr}
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
                d-value="{showAttribute(currentEdge, attr)}"
                value="{showAttribute(currentEdge, attr)}"
                on:input="{(event) => setAttribute(currentEdge, attr, event.target.value)}"
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
        <div class="c-group__title">edge custom attributes</div>
        <div class="c-group__list">
          {#if currentEdge}
          <!--  -->
          {#each graph.edgeAttributes as attr}
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
                d-value="{showAttribute(currentEdge, attr)}"
                value="{showAttribute(currentEdge, attr)}"
                on:input="{(event) => setAttribute(currentEdge, attr, event.target.value)}"
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
        <div class="c-group__title">new custom attribute</div>
        <div class="c-group__list">
          <div class="c-field">
            <div class="c-field__label">name</div>
            <div class="c-field__input">
              <input
                type="text"
                class="o-input c-input"
                bind:value="{newEdgeAttribute.name}"
              />
            </div>
          </div>

          <div class="c-field">
            <div class="c-field__label">type</div>
            <div class="c-field__input">
              <select
                type="text"
                class="o-input"
                bind:value="{newEdgeAttribute.type}"
              >
                <option value="string">string</option>
                <option value="int">int</option>
                <option value="float">float</option>
              </select>
            </div>
          </div>

          <div class="c-field">
            <div class="c-field__label">default value</div>
            <div class="c-field__input">
              <input
                type="text"
                class="o-input c-input"
                value="{showAttributeDefaultValue(newEdgeAttribute)}"
                on:input="{(event) => setAttributeDefaultValue(newEdgeAttribute, event.target.value)}"
              />
            </div>
          </div>

          {#if addEdgeAttributeErrorMsg}
          <div class="c-field">
            <div class="o-error">
              {addEdgeAttributeErrorMsg}
            </div>
          </div>
          {/if}

          <div class="c-field c-field--button">
            <button
              class="o-button o-button--active"
              on:click="{addEdgeAttribute}"
            >
              Add
            </button>
          </div>
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

  .c-field__action {
    flex: 0 0 auto;
  }

  .c-field__action i {
    font-size: 18px;
    color: hsl(0, 0%, 60%);
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
  import {
    readCamelCase,
    writeCamelCase
  } from '../../utils/string'

  let title = 'Untitled'
  let titleInput

  let tab = Tab.INFO
  let infoSubTab = InfoSubTab.DEFAULT

  let graph = new UndirectedGraph()
  let currentNode = null
  let currentEdge = null

  let newNodeAttribute = createAttribute()
  let addNodeAttributeErrorMsg = ''
  let newEdgeAttribute = createAttribute()
  let addEdgeAttributeErrorMsg = ''
  function createAttribute() {
    return {
      name: '',
      type: 'string'
    }
  }
  function addNodeAttribute() {
    if (newNodeAttribute.name.match(/^\s*$/)) {
      addNodeAttributeErrorMsg = 'attribute name is required'
    } else if (graph.hasNodeAttribute(newNodeAttribute)) {
      addNodeAttributeErrorMsg = 'attribute name already exists'
    } else {
      addNodeAttributeErrorMsg = ''
      newNodeAttribute.name = writeCamelCase(
        newNodeAttribute.name
      )
      graph.addNodeAttribute(newNodeAttribute)
      graph = graph

      newNodeAttribute = createAttribute()
    }
  }
  function removeNodeAttribute(attr) {
    graph.removeNodeAttribute(attr)
    update()
  }
  function addEdgeAttribute() {
    if (newEdgeAttribute.name.match(/^\s*$/)) {
      addEdgeAttributeErrorMsg = 'attribute name is required'
    } else if (graph.hasEdgeAttribute(newEdgeAttribute)) {
      addEdgeAttributeErrorMsg = 'attribute name already exists'
    } else {
      addEdgeAttributeErrorMsg = ''
      newEdgeAttribute.name = writeCamelCase(
        newEdgeAttribute.name
      )
      graph.addEdgeAttribute(newEdgeAttribute)
      update()

      newEdgeAttribute = createAttribute()
    }
  }
  function removeEdgeAttribute() {
    graph.removeEdgeAttribute(attr)
    update()
  }
  function showAttributeDefaultValue(attr) {
    return attr.defaultValue || ''
  }
  function setAttributeDefaultValue(attr, value) {
    let formattedValue

    try {
      if (attr.type === 'float') {
        formattedValue = parseFloat(value)
      } else if (attr.type === 'int') {
        formattedValue = parseInt(value)
      } else {
        formattedValue = value
      }

      attr.defaultValue = formattedValue

      newEdgeAttribute = newEdgeAttribute
      newNodeAttribute = newNodeAttribute
    } catch (error) {
      throw error
    }
  }

  export function update() {
    graph = graph
    currentNode = currentNode
    currentEdge = currentEdge
  }

  export let onUpdate = function() {}

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

      onUpdate()
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
</script>
