<template>
    <div>
        <!--路由组件出口位置-->
        <!--v-slot为插槽-->
        <router-view v-slot="{ Component }">
            <!--transition为过渡动画-->
            <transition name="fade">
                <!--component为动态组件-->
                <component :is="Component" :v-if="flag" />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang='ts' name='main'>
import { watch, ref, nextTick } from 'vue'
import { useLayoutSettingStore } from '../../store/modules/setting'
import { ElNotification } from 'element-plus'

let layoutSettingStore = useLayoutSettingStore()
// flag用于控制刷新页面：true页面展示，false销毁
let flag = ref(true)

// 监听仓库内refresh的变化，如果变化则刷新页面
watch(() => layoutSettingStore.refresh, () => {
    // 销毁页面
    flag.value = false
    // nextTick可以获取最新数据的dom，获取到最新数据后，再进行渲染
    nextTick(() => {
        // 重新渲染页面
        flag.value = true
        // 提示框
        ElNotification({
            title: '刷新成功',
            message: '刷新成功',
            type: 'success',
            duration: 1000,
        })
    })
})

</script>

<style lang='scss'>
/* 过渡动画 */
.fade-enter-from {
    /* 进入时透明度 */
    opacity: 0;
}

.fade-enter-active {
    /* 持续时间 */
    transition: all 0.5s ease;
}

.fade-leave-to {
    /* 完成时透明度 */
    opacity: 1;
}
</style>