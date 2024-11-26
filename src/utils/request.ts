// 二次封装axios，使用请求和响应拦截器

import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../store/modules/user'
// 1.利用axios对象的create方法创建一个axios实例
const request = axios.create({
    //基础路径
    baseURL: import.meta.env.VITE_APP_BASE_API,//基础路径上携带/api，所以请求路径上不用再携带/api
    //请求超时时间
    timeout: 5000
})
// 2.request实例添加请求拦截器：发起请求前，拦截请求，携带公共参数，携带token
request.interceptors.request.use((config)=>{
    // config是请求拦截器中携带的参数，headers属性为请求头，给服务器携带公共参数，如token
    // 返回config对象
    const userStore = useUserStore()
    // 判断是否携带token
    if(userStore.token){
        // 携带token时，将token添加到请求头中，服务器根据token判断用户是否登录，是否具有访问权限，从而返回不同的数据
        config.headers.token = userStore.token
    }
    return config
})
// 3.响应拦截器：服务器返回数据后，拦截响应，处理响应数据
request.interceptors.response.use((response)=>{
    //成功回调
    // response是响应拦截器中携带的参数，data属性为服务器返回的数据
    // 返回data对象
    return response.data
},(error)=>{
    //失败回调，处理http网络错误
    // message存储错误信息
    let message = ''
    // http状态码
    let status = error.response.status
    switch(status){
        case 400:
            message = '请求参数错误'
            break
        case 401:
            message = 'TOKEN过期，请重新登录'
            break
        case 403:
            message = '拒绝访问'
            break
        case 404:
            message = '请求资源不存在'
            break
        case 500:
            message = '服务器错误'
            break
        default:
            message = '请求超时或网络异常，请稍后再试'
            break
    }
    //提示错误信息
    ElMessage({
        type: 'error',
        message
    })

    // 返回一个Promise.reject对象，用于终止promise链
    return Promise.reject(error)
})

//暴露
export default request