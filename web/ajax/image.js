import axios from 'axios'

export async function loadSvgImage(el) {
  const dataSrc = el.getAttribute('data-src')

  const payload = await axios({
    method: 'GET',
    url: dataSrc
  })

  el.innerHTML = payload.data

  return payload.data
}
