const API_URL = {
  development: 'http://localhost:3000/api',
  production: ''
}

type ENV = 'development' | 'production'

export const BASE_URL = API_URL[import.meta.env.MODE as ENV]

