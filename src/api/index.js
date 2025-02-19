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
export function getMyArchiveList() {
  return fetchWrapper('/archive/getMyArchiveList')
}

export function setLocalConfig(data) {
  return fetchWrapper('/archive/setLocalConfig', 'post', data)
}
export function add(data) {
  return fetchWrapper('/archive/add', 'post', data)
}
export function useArchive(data) {
  return fetchWrapper('/archive/useArchive', 'post', data)
}

export function welcome() {
  return fetchWrapper('/welcome')
}
