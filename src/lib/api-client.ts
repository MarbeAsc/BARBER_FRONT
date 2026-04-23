import axios, { type AxiosInstance } from 'axios'
import { API_CONFIG } from './api-config'
import { useAuthStore } from './auth-store'

export const apiSSO: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  maxRedirects: 0,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiSSO.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.params = {
    ...config.params,
    _t: Date.now(),
  }
  return config
})

apiSSO.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const authStore = useAuthStore.getState()
      if (authStore.isAuthenticated) {
        authStore.logout()
      }
    }
    return Promise.reject(error)
  },
)
