// 使用vue-router插件实现模版化路由
import { createRouter, createWebHashHistory } from 'vue-router'
import {constantRouter} from './routers'

// 创建路由器实例
const router = createRouter({
    // 路由模式，默认为hash模式
    history: createWebHashHistory(),
    // 路由配置
    routes: constantRouter,
    // 滚动行为
    scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router