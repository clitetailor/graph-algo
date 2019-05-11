<div class="c-navbar">
  <div class="c-navbar__content u-content-width">
    <div class="c-navbar__title">Dashboard</div>
    <div class="c-navbar__item-list">
      <div class="c-navbar__item" on:click="{() => logout()}">
        Logout
      </div>
    </div>
  </div>
</div>

<style>
  .c-navbar {
    height: 56px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: stretch;
    border-bottom: 1px solid hsl(0, 0%, 80%);
    background: white;
  }

  .c-navbar__content {
    height: 100%;
    display: flex;
    align-items: stretch;
  }

  .c-navbar__title {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: hsl(0, 0%, 20%);
  }

  .c-navbar__item-list {
    flex: 0 0 auto;
    margin-right: -5px;
  }

  .c-navbar__item {
    padding: 5px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: hsl(0, 0%, 60%);
    cursor: pointer;
  }

  .c-navbar__item:hover {
    color: hsl(28, 100%, 50%);
  }
</style>

<script>
  import { usePage } from '../../utils/page'
  import { logout as _logout } from '../../graphql/auth'

  const page = usePage()

  export function logout() {
    _logout()
    page('/')
  }
</script>
