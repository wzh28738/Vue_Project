<template>
    <div class="container">
        <div ref="screenRef" class="screen">
            <div class="screen_content">
                <div class="left">
                    <Left />
                </div>
                <div class="center">
                    <Center />
                </div>
                <div class="right">
                    <Right />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang='ts' name="screen">
import { ref, onMounted } from 'vue'
import Left from './components/left/index.vue'
import Center from './components/center/index.vue'
import Right from './components/right/index.vue'

let screenRef = ref<HTMLElement>()
let w: number = 0
let h: number = 0

// 计算屏幕比例，返回值用于使页面自适应屏幕大小: width传入屏幕宽度，height传入屏幕高度
const computeScreen = (width: number, height: number) => {
    const screenWidth = window.innerWidth / width
    const screenHeight = window.innerHeight / height
    return screenWidth < screenHeight ? screenWidth : screenHeight
}

onMounted(() => {
    // 获取屏幕的宽高
    w = Number(getComputedStyle(screenRef.value as HTMLElement).width.replace('px', ''));
    h = Number(getComputedStyle(screenRef.value as HTMLElement).height.replace('px', ''));
    // 组件挂载完毕时，获取屏幕的宽高，并计算比例
    (screenRef.value as HTMLElement).style.transform = `scale(${computeScreen(w, h)}) translate(-50%, -50%)`
})

window.onresize = () => {
    // 监听窗口大小变化，重新计算比例
    (screenRef.value as HTMLElement).style.transform = `scale(${computeScreen(w, h)}) translate(-50%, -50%)`
}

</script>

<style lang='scss'>
.container {
    width: 100vw;
    height: 100vh;
    background: url('../../assets//images/bg.png') no-repeat;

    .screen {
        width: $screen-width;
        height: $screen-height;
        /**固定定位的元素相对于浏览器窗口进行定位，即使页面滚动，该元素也会保持在指定的位置。 */
        position: fixed;
        /**将元素的左边缘和上边缘定位在视口宽度和高度的50%处。也就是说，元素会水平居中于视口。 */
        left: 50%;
        top: 50%;
        transform-origin: left top;
        display: flex;
        .screen_content {
            width: 100%;
            height: 100%;
            display: flex;
            .left {
                flex: 1;
            }
            .center {
                flex: 2.5;
            }
            .right {
                flex: 1;
            }
        }

    }

}
</style>