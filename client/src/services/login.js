import axios from 'axios'
import { buildApiUrl } from './api'

const baseUrl = buildApiUrl('/api/login')

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
