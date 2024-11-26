<template>
    <div>
        <!--el-menu为菜单组件，el-menu-item为菜单内单个item,index为菜单的索引唯一标识-->
        <!--default-active为默认激活的菜单，保证刷新时不用重新打开，但是这里出现bug,未能实现-->
        <el-menu :collapse="LayoutSettingStore.isfold" :default-active="$route.path" background-color="$base-memu-background" text-color="white">
            <!--v-for循环遍历menuList数组，item为当前遍历的元素(是路由配置对象)，index为当前遍历的索引-->
            <template v-for="(item, index) in menuList" :key="index">

                <!--1.如果item没有children属性，则渲染el-menu-item-->
                <!--index=""里面为string,使用toString()-->
                <!--item.meta.hidden为true时，不渲染该路由-->
                <!--goRoute()中传入item.path即路由路径，用于路由跳转-->
                <el-menu-item @click="goRoute(item.path)" v-if="!item.children && item.meta.hidden != true"
                    :index="index.toString()">
                    <!--插入icon图标(不可以使用<Menu/>,因为和组件名<Menu/>冲突)-->
                    <el-icon color="white">
                            <!--component为动态组件，用于动态的生成需要的组件，is为组件名，item.meta.icon为当前路由的icon-->
                            <component :is="item.meta.icon"></component>
                        </el-icon>
                    <template #title>
                        <span>{{ item.meta.title }}</span>
                    </template>
                </el-menu-item>

                <!--2.如果item有children属性且只有一个children，则将其当做一级路由，渲染el-menu-item-->
                <el-menu-item @click="goRoute(item.path)" v-if="item.children && item.children.length == 1 && item.children[0].meta.hidden != true"
                    :index="index.toString()">
                    <el-icon color="white">
                            <component :is="item.children[0].meta.icon"></component>
                        </el-icon>
                    <template #title>
                        <span>{{ item.children[0].meta.title }}</span>
                    </template>
                </el-menu-item>

                <!--el-sub-menu为可展开菜单-->
                <!--3.如果item有children属性且大于1，则渲染el-sub-menu-->
                <el-sub-menu v-if="item.children && item.children.length > 1 && item.meta.hidden != true"
                    :index="index.toString()">
                    <template #title>
                        <el-icon color="white">
                            <component :is="item.meta.icon"></component>
                        </el-icon>
                        <span>{{ item.meta.title }}</span>
                    </template>
                    <!--如果子路由中还有孙路由，则递归调用Menu组件，将item.children作为参数传入，实现菜单的嵌套-->
                    <Menu :menu-list="item.children"></Menu>
                </el-sub-menu>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts" name="menu">
// 引入路由器
import { useRouter,useRoute } from 'vue-router'
// 引入layout设置相关的小仓库
import { useLayoutSettingStore } from '../../store/modules/setting'
// 获取layout设置的store
let LayoutSettingStore = useLayoutSettingStore()

// 获取路由器实例
const $router = useRouter()
// 获取父组件传来的路由数据
defineProps(['menuList'])

// 获取当前路由
const $route = useRoute()

// 点击菜单跳转路由，path为路由路径
const goRoute = (path: string) => {
    // 跳转路由
    $router.push(path)
}
</script>

<script lang="ts">
export default {
    name: 'Menu'
}
</script>

<style scoped lang="scss">
.el-menu {
    border-right: none;
}
/* 使.el-sub-menu内的.el-menu靠右移动10px */
::v-deep .el-sub-menu .el-menu {
  justify-content: flex-begin; /* 将标题内容靠右对齐 */
  left: 10px; /* 自动调整子菜单的左边距，使其靠右 */
  right: auto; /* 将子菜单靠右对齐 */
}
/* 设置折叠时侧边展开时的二级路由的宽度和背景 */
.el-menu-item {
    background-color: $base-memu-background;
    width: 62px;
}
</style>