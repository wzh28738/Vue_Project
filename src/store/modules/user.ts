// 用户相关的仓库

import { defineStore } from 'pinia'
// 引入登录请求接口
import { reqLogin, reqUserInfo, reqLogout } from '../../api/user'
// 引入mock假数据的类型
// import type { loginForm, loginResponseData } from '../../api/user/type.ts'
import type { UserState } from './types/type.ts'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '../../utils/token.ts'
//引入常量路由
import { constantRouter } from '../../router/routers.ts'

// 创建一个用户相关的仓库
export const useUserStore = defineStore('User', {
    // 小仓库数据
    state: (): UserState => {
        return {
            // 用户登录成功之后的token(唯一标识)，用于请求接口验证，用户的操作每次请求接口时需要携带
            // GET_TOKEN()中的localStorage.getItem('TOKEN')可以获取到本地存储中的token，保证刷新页面后，token不会丢失
            token: GET_TOKEN(),
            menuRoutes: constantRouter,// 仓库存储生成菜单需要的路由数组
            // 仓库存储用户信息,根据用户信息生成头像或者用户名
            username: '',
            avatar: '',
        }
    },
    // 异步和逻辑
    actions: {
        // 登录方法
        //async函数返回的是promise对象
        async userLogin(data: any) {
            // 调用登录接口
            let result: any = await reqLogin(data)
            // 登录请求：如果成功200，则返回token，否则失败201返回错误信息
            if (result.code === 200) {
                // 登录成功，将token保存到仓库中    
                this.token = (result.data as string)
                // 将token保存到本地存储中，保证刷新页面后，token不会丢失
                SET_TOKEN((result.data as string))
                // 登录成功，返回成功信息
                return 'ok'
            } else {
                // 登录失败，返回错误信息
                return Promise.reject(new Error(result.message))
            }
        },
        // 获取用户信息方法,将用户信息保存到用户仓库中，用于根据用户信息生成头像或者用户名等
        async getUserInfo() {
            // 获取用户信息,将用户信息保存到用户仓库中，用于根据用户信息生成头像或者用户名等    
            let result = await reqUserInfo()
            // 如果获取用户信息成功，将用户信息保存到用户仓库中
            if (result.code === 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                return 'ok'
            } else {
                // 如果获取用户信息失败，返回错误信息
                return Promise.reject(new Error(result.message))
            }
        },
        // 退出登录方法
        async userLogout() {
            // 调用服务器退出登录接口
            let result = await reqLogout()
            // 退出登录成功，清空仓库中的token
            if (result.code === 200) {
                // 清空仓库中的token
                this.token = ''
                // 清空用户仓库中的用户信息
                this.username = ''
                this.avatar = ''
                // 清空本地存储中的token
                REMOVE_TOKEN()
                return 'ok'
            } else {
                // 退出登录失败，返回错误信息
                return Promise.reject(new Error(result.message))
            }

        }
    },
    getters: {

    }
})