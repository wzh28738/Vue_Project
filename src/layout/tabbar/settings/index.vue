<template>
    <el-icon id="icon" class="icon_hover" @click="refresh" size="22">
        <Refresh />
    </el-icon>
    <el-icon class="icon_hover" @click="fullScreen" size="20">
        <FullScreen />
    </el-icon>
    <el-icon class="icon_hover" @click="setting" size="20">
        <Setting />
    </el-icon>
    <el-image class="avatar" :src="userStore.avatar" />
    <!--下拉菜单-->
    <el-dropdown>
        <span>
            <!--根据登录状态显示头像或者未登录-->
            {{ userStore.username ? userStore.username : '请登录...' }}
            <el-icon>
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang='ts' name='settings'>
import { useUserStore } from '../../../store/modules/user'
import { useRouter } from 'vue-router';
import { useLayoutSettingStore } from '../../../store/modules/setting'

// 获取布局setting仓库实例
let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
let $router = useRouter()

// 刷新页面
const refresh = () => {
    // 使用库中的方法刷新页面
    layoutSettingStore.refreshPage()
}
// 点击全屏
const fullScreen = () => {
    // 判断当前是否全屏
    let isFull = document.fullscreenElement
    if (isFull) {
        // 全屏状态下退出全屏
        document.exitFullscreen()
    } else {
        // 非全屏状态下进入全屏
        document.documentElement.requestFullscreen()
    }
}
// 点击退出登录
const logout = async () => {
    // 向服务器发送退出登录请求
    await userStore.userLogout()
    // 跳转到登录页面
    $router.push('/login')
}
// 点击设置
const setting = () => {
    console.log('点击设置')
    // 打开设置抽屉
    layoutSettingStore.changeSettingDrawerShow()
}
</script>

<style scoped lang='scss'>
.avatar {
    margin: 0px 6px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.icon_hover {
    margin-right: 10px;
}

.icon_hover:hover {
    color: rgb(53, 151, 255);
}

.el-drawer {
    position: absolute; top: 50px; left: 50px;
}
</style>