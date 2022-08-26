// 定义token字符串
const TokenKey = 'vue_admin_template_token'
// 从本地存储中获取token
export function getToken() {
  return localStorage.getItem(TokenKey)
}
// 从本地存储中设置token
export function setToken(token: string) {
  return localStorage.setItem(TokenKey, token)
}
// 从本地存储中删除token
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
