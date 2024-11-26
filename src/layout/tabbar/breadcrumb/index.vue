<template>
    <el-icon class="icon_hover"  size="23" @click="changeIcon">
        <!--根据store中的折叠或展开状态，展示不同的图标-->
        <Expand v-if="LayoutSettingStore.isfold" size="20"/>
        <Fold v-else="" />
    </el-icon>
    <!--面包屑导航-->
    <el-breadcrumb class="breadcrumb" separator-icon="ArrowRightBold">
        <!--当点击的是首页时，为避免展示出layout，进行判断再显示-->
        <el-breadcrumb-item v-if="$route.meta.title == '首页'" to="/home">
            <el-icon class="breadcrumb_icon">
                <!--根据路由中的icon展示不同的图标-->
                <component :is="$route.meta.icon" />
            </el-icon>
            <span class="breadcrumb_span">首页</span>
        </el-breadcrumb-item>
        <!--其他情况，直接渲染-->
        <el-breadcrumb-item v-else="" v-for="(item, index) in $route.matched" :key="index" :to="item.path">
            <el-icon class="breadcrumb_icon">
                <!--根据路由中的icon展示不同的图标-->
                <component :is="item.meta.icon" />
            </el-icon>
            <!--根据路由中的title展示不同的标题-->
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang='ts' name='breadcrumb'>
import { useRoute } from 'vue-router'
// 引入layout设置的store
import { useLayoutSettingStore } from '../../../store/modules/setting'
// $route中的matched属性，用于获取当前路由的路径信息，其中包括了其父级、祖父级等的路由信息
const $route = useRoute()

// 获取layout设置的store
let LayoutSettingStore = useLayoutSettingStore()
// 点击折叠或展开
const changeIcon = () => {
    // 调用store中的方法,切换折叠或展开状态
    LayoutSettingStore.changeIcon()
}
</script>

<style lang='scss'>
.breadcrumb {
    margin-left: 20px;

    .breadcrumb_item {
        border-color: red;
        display: flex;
        align-items: center;
    }
}
/* 使icon图标与字体对齐且适当调整距离 */
.breadcrumb_icon {
    vertical-align: middle;
    margin-bottom: 2px;
    margin-right: 3px
}
.icon_hover:hover {
    color: rgb(53, 151, 255);
}
</style>