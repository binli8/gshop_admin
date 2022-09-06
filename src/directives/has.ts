// 引入App类型
import type {App} from 'vue'
// 引入按钮的标识数组
import {useUserInfoStore} from '@/stores/userInfo'
// 暴露出去一个函数
export default (app:App) => {
    // 自定义指令
    app.directive('has',{
        // 声明周期钩子
        mounted(el,binding){
            // 按钮上使用v-has指令,传进来的是一个按钮的标识
            // 获取按钮标识数据
            const userInfoStore = useUserInfoStore()
            // 判断按钮标识数组是否有传入进来的字符串标识信息
            if (!userInfoStore.authBtnList.includes(binding.value)) {
                // 调用父级DOM,移除自己
                el.parentNode.removeChild(el)
            }
        }
    })
}