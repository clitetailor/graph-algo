<div class="c-home">
  <div class="c-home__left">
    <header class="c-header">
      {#if !comp}
      <nav class="c-navbar">
        <div class="c-navbar__item">
          <a on:click="{() => page('/login')}">Login</a>
        </div>
        <div class="c-navbar__item">
          <a on:click="{() => page('/signup')}">Signup</a>
        </div>
      </nav>
      {:else}
      <nav class="c-navbar">
        <div class="c-navbar__item">
          <a on:click="{() => page('/')}">
            <i class="material-icons">arrow_back</i>
            Back
          </a>
        </div>
      </nav>
      {/if}
    </header>

    <main class="c-main">
      {#if !comp}
      <div class="c-main__title">
        <h1>Graph Algo</h1>
      </div>
      <div class="c-main__getting-started">
        <button on:click="{() => page('/signup')}">
          Getting Started
        </button>
      </div>
      {:else}
      <svelte:component this="{comp}"></svelte:component>
      {/if}
    </main>
  </div>

  <div class="c-home__right"></div>
</div>

<style>
  .c-home {
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
  }

  .c-home__left {
    flex: 1;
    padding: 80px;
  }

  .c-home__right {
    flex: 1;
    background: linear-gradient(60deg, orange, orangered);
  }

  .c-navbar {
    margin-left: -60px;
    display: flex;
  }

  .c-navbar__item {
    position: relative;
    margin-left: 60px;
    font-size: 20px;
    cursor: pointer;
  }

  .c-navbar__item i {
    margin-right: 10px;
    font-size: 20px !important;
    transform: translateY(2px);
  }

  .c-navbar__item::after {
    content: '';
    position: absolute;
    left: 0;
    right: 100%;
    bottom: -3px;
    height: 2px;
    background: black;
    transition: right 0.2s;
  }

  .c-navbar__item:hover::after {
    right: 0;
  }

  .c-main {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }

  .c-main__title {
    margin-top: -114px;
    font-size: 28px;
  }

  .c-main__getting-started button {
    padding: 16px 28px;
    color: white;
    font-size: 18px;
    /* background: orange; */
    background: black;
    border: none;
    /* border-radius: 29px; */
    border-radius: 0;
    outline: none;
    cursor: pointer;
  }

  .c-main :global(.c-form__title) {
    margin-top: -100px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 24px;
  }

  .c-main :global(.c-input__field) {
    margin-bottom: 20px;
  }

  .c-main :global(.c-input__field label) {
    margin-bottom: 5px;
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    text-transform: capitalize;
  }

  .c-main :global(.c-input__field input) {
    padding: 8px;
    width: 400px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    border: 2px solid black;
    border-radius: 0;
  }

  /*
  .c-main :global(.c-button__groups) {
    width: 400px;
    display: flex;
    justify-content: flex-end;
  }
  */

  .c-main :global(.c-button__groups button) {
    margin-top: 0.83em;
    padding: 10px 18px;
    color: white;
    font-size: 18px;
    /* background: orange; */
    background: black;
    border: none;
    /* border-radius: 29px; */
    border-radius: 0;
    outline: none;
    cursor: pointer;
  }

  .c-main :global(.c-error__message) {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    color: red;
  }
</style>

<script>
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import { usePage, requireAuth } from '../../utils/page'

  import Login from './login.svelte'
  import Signup from './signup.svelte'

  const page = usePage()

  let comp

  page('/', () => {
    comp = undefined
  })
  page('/login', () => {
    comp = Login
  })
  page('/signup', () => {
    comp = Signup
  })
</script>
