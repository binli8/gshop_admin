import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import { ElMessage } from 'element-plus'

// 引入登录相关的接口(登录接口函数,获取用户信息的接口函数,退出的接口函数)
import { loginApi, getUserInfoApi, logoutApi } from '@/api/acl/login'
// 引入静态路由 / 动态路由 / 任意路由
import { staticRoutes, allAsyncRoutes, anyRoute } from '@/router/routes'
// 引入路由器
import router from '@/router'
// 引入路由对象相关的数据类型
import { RouteRecordRaw } from 'vue-router'
// 引入深拷贝的方法
import cloneDeep from 'lodash/cloneDeep'



// 过滤路由
function filterRoutes(asyncRoutes: RouteRecordRaw[], routeName: string[]) {
  return asyncRoutes.filter(route => {
    // 判断路由名字数组中是否有存在路由信息对象的名字
    if (routeName.indexOf(route.name as string) === -1) return false
    // 判断路由对象是否有子路由
    if (route.children && route.children.length > 0) {
      // 递归过滤
      route.children = filterRoutes(route.children, routeName)
    }
    return true
  })
}
// 通过路由器进行路由的注册
function addRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(route => {
    // 添加路由的方法
    router.addRoute(route)
  })
}
// 重置路由
function resetRouter() {
  // 获取路由的方法
  const routes = router.getRoutes()
  // 路由器中所有的路由都移除了
  routes.forEach(route => {
    if (route.name) {
      // 移除路由
      router.removeRoute(route.name)
    }
  })
  // 移除所有路由后,重新的把静态路由存储起来(注册路由)
  staticRoutes.forEach(r => router.addRoute(r))
}
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {
  // 状态数据
  state: (): UserInfoState => ({
    token: getToken() as string,      //token信息
    name: '',       //用户名字
    avatar: '',     //头像
    menuRoutes: [], //路由相关信息
    roles: [],      //角色名字数组
    authBtnList: []  //按钮标识数组 
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
      this.menuRoutes = staticRoutes
      // 存储按钮和角色的路由的相关信息
      this.roles = result.roles
      this.authBtnList = result.buttons

      // this.xxx = result.routes
      // 储存按钮和角色和路由的相关信息
      // this.menuRoutes = staticRoutes
      // console.log(this.menuRoutes);
      // 过滤路由
      this.setRoutes(result.routes)
    },
    setRoutes(routeName: string[]) {
      // 过滤路由(动态路由,路由名字数组进行对比,最终过滤出来的新的路由数组是用户应该可以看到的菜单)
      // 深拷贝
      const asyncRoutes = filterRoutes(cloneDeep(allAsyncRoutes), routeName)
      // 注册路由,把之前路由器中没有注册过的路由对象,重新注册
      addRoutes([...asyncRoutes, anyRoute])
      // 重新添加路由(存储路由,为了让用户看到菜单)
      this.menuRoutes = [...staticRoutes, ...asyncRoutes]
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
      // 重置路由
      resetRouter()
      // 清空存储的路由信息
      this.menuRoutes=[]
      // 清空按钮标识
      this.authBtnList=[]
      // 清空角色名字数组
      this.roles=[]
    },
  },
});
