<form class="c-form" on:submit="{onSubmit}">
  <div class="c-form__title">
    <h2>Login</h2>
  </div>
  <div class="c-input__field">
    <label for="username">Username</label>
    <input
      type="text"
      name="username"
      bind:value="{username}"
    />
  </div>
  <div class="c-input__field">
    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      bind:value="{password}"
    />
  </div>
  <div class="c-error__message">
    {errMsg}
  </div>
  <div class="c-button__groups">
    <button class="c-button">
      Submit
    </button>
  </div>
</form>

<script>
  import { usePage } from '../../utils/page'
  import { login } from '../../graphql/auth'

  const page = usePage()

  let username = ''
  let password = ''

  let errMsg = ''

  async function onSubmit(event) {
    event.preventDefault()

    try {
      await login(username, password)
      page('/dashboard')
    } catch (error) {
      if (error.graphQLErrors) {
        errMsg = error.graphQLErrors[0].message
      } else {
        errMsg = error.message
      }
    }
  }
</script>
