import axios from 'axios'

export async function loadSvgImage(dataSrc) {
  const payload = await axios({
    method: 'GET',
    url: dataSrc
  })

  return payload.data
}
