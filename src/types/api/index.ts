export interface ResponseData<T = any> {
  code: number
  data: Pagination<T> | T
  message: string
}

export interface Pagination<T> {
  list: T
  page: number
  pageSize: number
  total: number
}