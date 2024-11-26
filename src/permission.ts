// // 路由鉴权，设置项目中能否访问某些页面
// import router from './router'
// // 引入nprogress插件，用于路由跳转时显示进度条
// // @ts-ignore
// import nprogress from 'nprogress'
// // 引入nprogress的样式，用于路由跳转时显示进度条
// import 'nprogress/nprogress.css'
// import pinia from './store'
// // 引入store
// import { useUserStore } from './store/modules/user'

// // 取消加载时出现的圆圈
// nprogress.configure({
//     showSpinner: false,
// })
// let userStore = useUserStore(pinia)

// // 全局后卫，项目中所有路由跳转都会经过这个函数

// // 全局前置守卫：路由跳转前会先执行这个函数
// //to:即将要进入的目标路由对象，from:当前导航正要离开的路由，next:路由的钩子函数，next()放行，next('/login')跳转
// router.beforeEach(async (to: any, from: any, next: any) => {
//     // 开启进度条
//     nprogress.start()
//     let token = userStore.token
//     let username = userStore.username
//     let avatar = userStore.avatar
//     // 获取token,判断是否登录
//     if (token) {
//         // 已登录, 判断是否是登录页面
//         if (to.path == '/login') {
//             // 是登录页面，跳转到首页
//             next({ path: '/' })
//         } else {
//             // 不是登录页面

//             // 如果有用户信息，直接放行
//             if (username && avatar) {
//                 next()
//             } else {
//                 // 没有用户信息，获取用户信息再放行
//                 try {
//                     await userStore.getUserInfo()
//                     // 获取用户信息成功，放行
//                     next()
//                 } catch (error) {
//                     // token失效或者token被修改，清除token，跳转到登录页面
//                     await userStore.userLogout()
//                     // 跳转到登录页面,并记录当前页面路径,登录成功后自动跳转到该页面
//                     next({ path: '/login', querry: { redirect: to.path } })
//                 }
//             }
//         }
//     } else {
//         // 未登录,判断是否是登录页面
//         if (to.path == '/login') {
//             // 是登录页面，直接放行
//             next()
//         } else {
//             // 不是登录页面，跳转到登录页面,并记录当前页面路径,登录成功后自动跳转到该页面
//             next({ path: '/login', querry: { redirect: to.path } })
//         }
//     }
// })
// // 全局后置守卫：路由跳转后执行
// router.afterEach((to: any, from: any) => {
//     // 设置页面标题
//     document.title = '后勤管理-' + to.meta.title
//     // 关闭进度条
//     nprogress.done()
// }) 