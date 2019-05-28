<div class="c-menu">
  <div class="c-menu__icon" on:click={beforeUpload}>
    <input
      class="c-menu__hidden-input"
      type="file"
      on:input={onUpload}
      bind:this={fileInput} />
    <i class="material-icons">attach_file</i>
  </div>
  <div class="c-menu__icon" on:click={onDownload}>
    <i class="material-icons">move_to_inbox</i>
  </div>
  <div class="c-menu__icon" on:click={onSave}>
    <i class="material-icons">save</i>
  </div>
  <div class="c-menu__icon" on:click={onBack}>
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

  .c-menu__hidden-input {
    display: none;
  }
</style>

<script>
  let fileInput

  export let onSave = function() {}
  export let onBack = function() {}
  export let onDownload = function() {}
  export let onUpload = function() {}

  function beforeUpload() {
    if (fileInput) {
      fileInput.click()
    }
  }
</script>
