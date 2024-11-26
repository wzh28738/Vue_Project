<template>
  <!--卡片-->
  <el-card>
    <div class="box-card">
      <el-image :src="userStore.avatar" class="avatar"></el-image>
      <div class="text-box">
        <h3 class="title">你好，{{ userStore.username }}</h3>
        <p class="decription">欢迎登录后台管理系统</p>
      </div>
    </div>

  </el-card>
</template>

<script setup lang="ts" name="home">
import { ref } from "vue";
import { useUserStore } from "../../store/modules/user"

let userStore = useUserStore()

</script>

<style scoped lang="scss">
.box-card {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .text-box {
    margin: 15px 0 20px 20px;
  }

  .title {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 10px
  }

  .decription{

  }
}
</style>