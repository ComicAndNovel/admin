const API_URL = {
  development: 'http://localhost:3000/api',
  production: ''
}

type ENV = 'development' | 'production'

export const BASE_URL = API_URL[import.meta.env.MODE as ENV]

export const update_status = {
  1: '未出版',
  2: '连载中',
  3: '已完结'
}
