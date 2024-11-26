//全局组件注册

//引入用到的全局组件
import SvgIcon from "./SvgIcon/index.vue";
import Pagination from "./Pagination/index.vue";
import Category from "./Category/index.vue";
// 引入element-plus图标为全局组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//将全局组件包成对象
const allGlobalComponent = { SvgIcon, Pagination, Category }

// 对外暴露插件对象
export default {
    install(app: any) {
        //一次性注册所有全局组件
        Object.keys(allGlobalComponent).forEach(key => {
            //注册为全局组件
            //@ts-ignore
            app.component(key, allGlobalComponent[key])
        });
        // 循环遍历，将element-plus图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }

    }
}