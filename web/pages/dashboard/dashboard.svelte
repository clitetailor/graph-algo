<div class="c-dashboard">
  <header class="c-dashboard__header">
    <Navbar></Navbar>
  </header>

  <main class="c-dashboard__main">
    <div class="u-content-width">
      <Create></Create>
      <Recent></Recent>
    </div>
  </main>
</div>

<style>
  .c-dashboard {
    height: 100%;
    padding-top: 56px;
  }

  .c-dashboard :global(.u-content-width) {
    width: 1200px;
  }

  .c-dashboard__main {
    padding-top: 30px;
    display: flex;
    justify-content: center;
  }

  .c-dashboard :global(.c-group) {
    margin-bottom: 30px;
  }

  .c-dashboard :global(.c-group__title) {
    margin-bottom: 15px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    font-weight: bold;
    color: hsl(0, 0%, 20%);
  }
</style>

<script>
  import Navbar from './navbar.svelte'
  import Create from './create.svelte'
  import Recent from './recent.svelte'
</script>
