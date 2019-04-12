import { onMount, onDestroy, tick } from 'svelte'
import pagejs from 'page'
import { beforeUpdate } from 'svelte/internal'

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
