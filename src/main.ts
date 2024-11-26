import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";
// 配置element-plus为中文
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// element-plus暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import globalComponent from "./components/index.ts"
//svg插件配置
import 'virtual:svg-icons-register'
//引入scss全局样式
import './styles/index.scss'
//引入路由
import router from './router'
// 引入pinia仓库
import pinia from './store/index.ts';
// 引入路由鉴权
import './permission.ts'


// 获取应用实例对象
const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus,{
    locale:zhCn
})
// 自定义插件对象，注册项目的全局组件
app.use(globalComponent)
// 注册路由
app.use(router)
// 注册pinia仓库
app.use(pinia)

// 将应用挂载到挂载点上
app.mount('#app')
