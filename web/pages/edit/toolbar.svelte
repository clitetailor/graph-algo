<div class="c-toolbar">
  <div
    class="c-toolbar__icon"
    class:is-active="{mode === Mode.SELECT}"
    on:click="{() => setMode(Mode.SELECT)}"
  >
    <SvgImg src="/images/edit/select-mode.svg"></SvgImg>
  </div>
  <div
    class="c-toolbar__icon"
    class:is-active="{mode === Mode.MOVE}"
    on:click="{() => setMode(Mode.MOVE)}"
  >
    <SvgImg src="/images/edit/move-mode.svg"></SvgImg>
  </div>
  <div
    class="c-toolbar__icon"
    class:is-active="{mode === Mode.NODE}"
    on:click="{() => setMode(Mode.NODE)}"
  >
    <SvgImg src="/images/edit/node-mode.svg"></SvgImg>
  </div>
  <div
    class="c-toolbar__icon"
    class:is-active="{mode === Mode.LINE}"
    on:click="{() => setMode(Mode.LINE)}"
  >
    <SvgImg src="/images/edit/line-mode.svg"></SvgImg>
  </div>
</div>

<style>
  .c-toolbar {
    height: 100%;
    width: 57px;
    border-right: 1px solid hsl(0, 0%, 80%);
  }

  .c-toolbar__icon {
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  .c-toolbar__icon.is-active::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    width: 2px;
    height: 28px;
    border-radius: 2px;
    background: hsl(28, 100%, 50%);
  }

  .c-toolbar__icon :global(svg path) {
    fill: hsl(0, 0%, 60%) !important;
  }

  .c-toolbar__icon :global(svg) {
    width: 24px;
    height: 24px;
  }

  .c-toolbar__icon.is-active :global(svg path) {
    fill: hsl(28, 100%, 50%) !important;
  }
</style>

<script>
  import SvgImg from '../shared/svg-img.svelte'

  import { Mode } from './graph-network/graph-network.svelte'

  let mode = Mode.SELECT

  export let onModeChange = function() {}
  export let onBackButtonClick = function() {}
  export let onSave = function() {}

  export function setMode(newMode) {
    mode = newMode
    onModeChange(mode)
  }
</script>
