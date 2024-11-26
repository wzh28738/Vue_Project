<template>
    <div class="layou_container">
        <!--左侧菜单--> <!--小仓库中isfold为true时，启用该class进行折叠-->
        <div class="left_menu" :class="{ fold: LayoutSettingStore.isfold }">
            <Logo></Logo>
            <!--滚动组件--> <!--el-scrollbar为滚动视图，当内容超出容器时，可以滚动-->
            <el-scrollbar class="scrollbar">
                <!--菜单组件-->
                <Menu :menuList="userStore.menuRoutes"></Menu>
            </el-scrollbar>
        </div>
        <!--顶部导航--> <!--小仓库中isfold为true时，启用该class进行展开-->
        <div class="top_nav" :class="{ fold: LayoutSettingStore.isfold }">
            <Tabbar></Tabbar>
        </div>
        <!--右侧内容--> <!--小仓库中isfold为true时，启用该class进行展开-->
        <div class="right_content" :class="{ fold: LayoutSettingStore.isfold }">
            <Main></Main>
        </div>
    </div>
    <!--抽屉：设置-->
    <el-drawer v-model="LayoutSettingStore.isSettingDrawerShow">
        <template #header>
            <h4>设置</h4>
        </template>
        <template #default>
            <el-form>
              <el-form-item label="主题颜色">
                <el-color-picker @change="changeColor" style="margin-left: 20px;" v-model="color" :predefine="predefineColors" />
            </el-form-item>
              <el-form-item label="暗黑模式">
                <el-switch style="margin-left: 20px;" @change="changeToDark" v-model="switchValue" inline-prompt active-icon="Moon" inactive-icon="Sunny" />
            </el-form-item>
            </el-form>
        </template>
    </el-drawer>
</template>

<script setup lang="ts" name="layout">
import { ref } from 'vue'
import Logo from '../layout/logo/index.vue'
import Menu from '../layout/menu/index.vue'
import Main from '../layout/main/index.vue'
import Tabbar from '../layout/tabbar/index.vue'
// 获取用户相关小仓库
import { useUserStore } from '../store/modules/user'
// 引入layout设置相关的小仓库
import { useLayoutSettingStore } from '../store/modules/setting'

let userStore = useUserStore()
// 获取layout设置的store
let LayoutSettingStore = useLayoutSettingStore()
let switchValue = ref(false)
// 颜色选择器数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 修改颜色
const changeToDark = () => {
    let html = document.documentElement
    if (switchValue.value) {
        html.className = 'dark'
    } else {
        html.className = ''
    }
}
// 修改主题颜色
const changeColor = () => {
    let html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
    name: 'Layout'
}
</script>

<style scoped lang="scss">
.layou_container {
    width: 100%;
    height: 100vh;

    /* 左侧菜单 */
    .left_menu {
        width: $base-memu-width;
        height: 100%;
        background: $base-memu-background;
        /* 小仓库中isfold为true时的折叠动画 */
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100% - 50px);
        }
        /* 小仓库中isfold为true时，启用该class进行折叠 */
        &.fold {
            width: $base-memu-min-width;
        }
    }
    /* 顶部导航 */
    .top_nav {
        position: fixed;
        width: calc(100% - $base-memu-width);
        height: $base-nav-height;
        top: 0px;
        left: $base-memu-width;
        /* 小仓库中isfold为true时的折叠动画 */
        transition: all 0.3s;
        /* 小仓库中isfold为true时，启用该class进行折叠 */
        &.fold {
            width: calc(100% - $base-memu-min-width);
            left: $base-memu-min-width;
        }
    }
    /* 右侧内容 */
    .right_content {
        position: fixed;
        width: calc(100% - $base-memu-width);
        height: calc(100% - $base-nav-height);
        top: $base-nav-height;
        left: $base-memu-width;
        padding: 20px;
        overflow: auto;
        /* 小仓库中isfold为true时的折叠动画 */
        transition: all 0.3s;
        /* 小仓库中isfold为true时，启用该class进行折叠 */
        &.fold {
            width: calc(100% - $base-memu-min-width);
            left: $base-memu-min-width;
        }
    }
}
</style>