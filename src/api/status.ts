const status = {
  400: '参数错误',
  403: '没有权限',
  404: '地址不存在',
  405: '请求方式异常',
  500: '服务器异常',
  503: '服务器挂掉了',
  504: '服务器找不到了'
}

export default new Map(
  Object.entries(status)
)