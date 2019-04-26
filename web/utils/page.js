import { onMount, onDestroy } from 'svelte'
import pagejs from 'page'

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
