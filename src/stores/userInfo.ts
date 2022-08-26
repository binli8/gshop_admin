import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import { ElMessage } from 'element-plus'
import { staticRoutes } from '@/router/routes'
// 引入登录相关的接口(登录接口函数,获取用户信息的接口函数,退出的接口函数)
import { loginApi, getUserInfoApi, logoutApi } from '@/api/acl/login'

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

  state: (): UserInfoState => ({
    token: getToken() as string,
    name: '',
    avatar: '',
    menuRoutes: []
  }),

  actions: {
    // 登录的方法,传入用户名和密码
    async login(username: string, password: string) {
      // 登录,传入账号和密码
      const { token } = await loginApi(username, password)
      // 存储token
      this.token = token
      // 存储token
      setToken(token)
    },

    // 获取用户信息的方法
    async getInfo() {
      const result = await getUserInfoApi()
      // 存储用户信息
      this.name = result.name     //用户名
      this.avatar = result.avatar // 头像
      // 存储按钮和角色的路由的相关信息
    },

    // 重置用户信息的方法
    async reset() {
      if (this.name) {
        await logoutApi()
      }
      // 删除local中保存的token
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
      this.name = ''
      this.avatar = ''
    },
  },
});
