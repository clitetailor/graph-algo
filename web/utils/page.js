import { onMount, onDestroy } from 'svelte'
import pagejs from 'page'

import { checkAuth } from '../graphql/auth'

export function usePage() {
  const page = pagejs.create()

  onMount(() => {
    page.start()
  })
  onDestroy(() => {
    page.stop()
  })

  return page
}

export function requireAuth(
  authStatus = true,
  load,
  otherwise
) {
  onMount(async () => {
    const payload = await checkAuth()

    if (authStatus && !payload.data.checkAuth.ok) {
      if (otherwise) otherwise()
      return
    }

    if (!authStatus && payload.data.checkAuth.ok) {
      if (otherwise) otherwise()
      return
    }

    if (load) load()
  })
}
