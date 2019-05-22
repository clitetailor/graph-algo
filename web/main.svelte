<svelte:component this="{comp}"></svelte:component>
<a class="c-downloader" id="downloader" href="/"></a>

<style>
  .c-downloader {
    visibility: hidden;
  }
</style>

<script>
  import { usePage } from './utils/page'
  import { client } from './graphql/client'
  import { checkAuth } from './graphql/auth'

  import Home from './pages/index/index.svelte'
  import Dashboard from './pages/dashboard/dashboard.svelte'
  import Edit from './pages/edit/edit.svelte'

  import DeepFirstSearch from './pages/algo/deep-first-search/deep-first-search.svelte'
  import BreathFirstSearch from './pages/algo/breath-first-search/breath-first-search.svelte'
  import PageRank from './pages/algo/page-rank/page-rank.svelte'
  import Hits from './pages/algo/hits/hits.svelte'

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

  page('/algo/deep-first-search', () => {
    requireAuth(() => {
      comp = DeepFirstSearch
    })
  })
  page('/algo/breath-first-search', () => {
    requireAuth(() => {
      comp = BreathFirstSearch
    })
  })
  page('/algo/page-rank', () => {
    requireAuth(() => {
      comp = PageRank
    })
  })
  page('/algo/hits', () => {
    requireAuth(() => {
      comp = Hits
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
