import axios from 'axios'

const API_URL = 'http://localhost:3000'

const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/refreshToken`, {
      token: localStorage.getItem('accessToken')
    })
    localStorage.setItem('accessToken', response.data.accessToken)
    return response.data
  } catch (e) {
    console.error(e)
  }
}

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  async (error) => {
    const originalRequest = error.config

    // Try to refresh token on 401 error
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const res = await refreshToken()
      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.accessToken)

        return axios(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default axios
