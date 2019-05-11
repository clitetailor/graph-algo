<svelte:component this="{comp}"></svelte:component>

<script>
  import { usePage } from './utils/page'
  import { client } from './graphql/client'
  import { checkAuth } from './graphql/auth'

  import Home from './pages/index/index.svelte'
  import Dashboard from './pages/dashboard/dashboard.svelte'
  import Edit from './pages/edit/edit.svelte'

  const page = usePage()
  let comp

  page('/', () => {
    notRequireAuth(() => {
      comp = Home
    })
  })
  page('/dashboard', () => {
    requireAuth(() => {
      comp = Dashboard
    })
  })
  page('/edit', () => {
    requireAuth(() => {
      comp = Edit
    })
  })

  async function requireAuth(callback) {
    const authStatus = await checkAuth()

    if (authStatus.ok) {
      callback()
    } else {
      page('/')
    }
  }

  async function notRequireAuth(callback) {
    const authStatus = await checkAuth()

    if (!authStatus.ok) {
      callback()
    } else {
      page('/dashboard')
    }
  }
</script>
