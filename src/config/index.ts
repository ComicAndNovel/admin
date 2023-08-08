const API_URL = {
  development: 'http://localhost:8080/api',
  production: ''
}

type ENV = 'development' | 'production'

export const BASE_URL = API_URL[import.meta.env.MODE as ENV]

