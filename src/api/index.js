import axios from 'axios'
const fetchPath = 'http://localhost:9001'
async function fetchWrapper(url, method = 'get', data = null) {
  const result = await axios({
    url: fetchPath + url,
    method,
    data,
  })
  return result.data
}

export function getLocalConfig() {
  return fetchWrapper('/archive/getLocalConfig')
}
export function getArchiveList() {
  return fetchWrapper('/archive/getArchiveList')
}

export function setLocalConfig(data) {
  return fetchWrapper('/archive/setLocalConfig', 'post', data)
}


export function welcome() {
  return fetchWrapper('/welcome')
}
