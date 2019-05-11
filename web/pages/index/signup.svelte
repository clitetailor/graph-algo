<form action="#" class="c-form" on:submit="{onSubmit}">
  <div class="c-form__title">
    <h2>Signup</h2>
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
  <div class="c-input__field">
    <label for="confirm-password">Password Confirm</label>
    <input
      type="password"
      name="confirm-password"
      bind:value="{confirmPassword}"
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
  import { signup } from '../../graphql/auth'

  const page = usePage()

  let username = ''
  let password = ''
  let confirmPassword = ''

  let errMsg = ''

  async function onSubmit(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      errMsg = 'Password does not match'
      return
    }

    try {
      await signup(username, password)
      page('/dashboard')
    } catch (error) {
      if (error.graphQLErrors) {
        errMsg = error.graphQLErrors[0].message
      } else {
        throw error
      }
    }
  }
</script>
