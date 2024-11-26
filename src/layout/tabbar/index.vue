<template>
    <!--导航栏-->
    <div class="tabbar">
        <!--导航栏左侧-->
        <div class="tabbar_left">
            <!--面包屑-->
            <Breadcrumb/>
        </div>
        <!--导航栏右侧-->
        <div class="tabbar_right">
            <Settings/>
        </div>
    </div>
</template>

<script setup lang='ts' name="tabbar">
import Breadcrumb from './breadcrumb/index.vue'
import Settings from './settings/index.vue'

</script>

<style scoped lang='scss'>
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tabbar_left {
        justify-content: center;
        align-items: center;
        display: flex;
        margin-left: 10px
    }

    .tabbar_right {
        justify-content: center;
        align-items: center;
        display: flex;

        margin-right: 20px;
    }
}
</style>