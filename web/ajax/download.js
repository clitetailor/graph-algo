import axios from 'axios'

export async function downloadGraphML(graph) {
  const payload = await axios({
    url: '/download/graphml',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      graph
    },
    responseType: 'blob'
  })

  const downloader = document.getElementById('downloader')
  const url = window.URL.createObjectURL(
    new Blob([payload.data])
  )

  downloader.href = url
  downloader.setAttribute('download', 'graph.graphml')

  downloader.click()
}
