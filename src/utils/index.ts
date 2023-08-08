export const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// 数字、字母、下划线 .
export const passwordRegExp = /^[A-Za-z0-9_\-.]{6,16}$/

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')

  try {
    return userInfo ? JSON.parse(userInfo) : {}
  } catch (err) {

  }
}