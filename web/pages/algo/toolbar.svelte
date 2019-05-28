<div class="c-toolbar">
  <div
    class="c-toolbar__icon"
    class:is-active={mode === Mode.SELECT}
    on:click={() => setMode(Mode.SELECT)}>
    <SvgImg src="/images/edit/select-mode.svg" />
  </div>
  <div
    class="c-toolbar__icon"
    class:is-active={mode === Mode.MOVE}
    on:click={() => setMode(Mode.MOVE)}>
    <SvgImg src="/images/edit/move-mode.svg" />
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

  import { Mode } from '../shared/graph-network/graph-network.svelte'

  export let mode = Mode.SELECT

  export function setMode(newMode) {
    mode = newMode
  }
</script>
