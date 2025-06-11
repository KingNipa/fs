import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () =>
  axios.get(baseUrl).then(response => response.data)


const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data

}


//poisto 5.11:
export const remove = id => {
  const config = { headers: { Authorization: token } }
  return axios.delete(`${baseUrl}/${id}`, config).then(r => r.data)
}

export default { getAll, create, setToken, update, remove }