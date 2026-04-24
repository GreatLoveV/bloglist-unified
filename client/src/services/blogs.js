import axios from 'axios'
import { buildApiUrl, getAuthConfig } from './api'

const baseUrl = buildApiUrl('/api/blogs')

let token = null

const setToken = (newToken) => {
  token = newToken || null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = getAuthConfig(token)
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, updatedObject) => {
  const config = getAuthConfig(token)

  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
  return response.data
}

const remove = async (id) => {
  const config = getAuthConfig(token)

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  console.log(response.data)
  return response.data
}

export default { getAll, create, update, remove, setToken }
