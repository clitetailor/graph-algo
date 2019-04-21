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
  let destroyed = false

  onMount(async () => {
    const result = await checkAuth()

    if (destroyed) {
      return
    }

    if (authStatus && !result.ok) {
      if (otherwise) {
        otherwise()
      }

      return
    }

    if (!authStatus && result.ok) {
      if (otherwise) {
        otherwise()
      }

      return
    }

    if (load) {
      load()
    }
  })

  onDestroy(() => {
    destroyed = true
  })
}
