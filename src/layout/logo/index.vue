<template>
    <div class="logo">
        <el-image src="../../assets/images/logo.jpg" />
        <!--layout页面出现折叠时，取消展示该文字，避免组件错位-->
        <h1>后勤管理系统</h1>
        
    </div>
</template>

<script setup lang="ts" name="logo">

</script>

<style scoped lang="scss">
.logo {
    width: 100%;
    display: flex;
    align-items: center;
    color: white;
    transition: all 0.3s ;
    .el-image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    p {
        margin-left: 10px;
        font-size: 20px;
    }
    h1{
        /* 超出盒子时，取消换行 */
        white-space: nowrap;
    }
}
</style>