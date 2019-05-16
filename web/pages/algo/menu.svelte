<div class="c-menu">
  <div class="c-menu__icon" on:click="{onBack}">
    <i class="material-icons">arrow_back</i>
  </div>
</div>

<style>
  .c-menu {
    margin: 7px;
    display: flex;
  }

  .c-menu__icon {
    margin: 7px;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    color: hsl(0, 0%, 60%);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .c-menu__icon:hover {
    color: hsl(261, 100%, 50%);
    background: hsla(261, 100%, 50%, 0.2);
  }
</style>

<script>
  export let onBack = function() {}
</script>
