import axios from 'axios'

export async function uploadGraphML(graphml) {
  const payload = await axios({
    url: '/upload/graphml',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      graphml
    }
  })

  return payload.data.graph
}
