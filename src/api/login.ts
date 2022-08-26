// 登录相关的接口函数的定义
// 引入登录相关的数据的接口类型
import type{LoginResponseModel,LoginUserResponseModel} from './model/loginModel'
// 引入 request
import request from '@/utils/request'
// 定义枚举类型的接口地址数据
enum Api{
    Login ='/admin/acl/index/login',        //登录的接口地址
    Info ='/admin/acl/index/info',          //获取用户信息的接口地址
    Logout = '/admin/acl/index/logout'      //退出的接口地址
}
// 定义登录的接口函数
export const loginApi = (username:string,password:string) =>request.post<any,LoginResponseModel>(Api.Info,{
    username,password
})
// 定义获取用户信息的接口函数
export const infoApi = () => request.get<any,LoginUserResponseModel>(Api.Info)
// 定义退出的接口函数
export const logoutApi = () => request.post<any,null>(Api.Logout)
