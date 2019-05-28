<div class="c-svg-img" bind:this={svgImg} />

<style>
  .c-svg-img {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<script>
  import { onMount } from 'svelte'

  import { loadSvgImage } from '../../ajax/image'

  let svgImg
  export let src
  export let width = 'auto'
  export let height = 'auto'

  onMount(async () => {
    const data = await loadSvgImage(src)
    svgImg.innerHTML = data
  })
</script>
