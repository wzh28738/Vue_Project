<template>
  <div class="login_container">
    <el-row>
      <el-col :span="8" :offset="0" :xs="0"></el-col>
      <el-col :span="8" :offset="0" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
          <h1>Hello</h1>
          <h2>请登录</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" type="text" v-model="loginForm.username" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" v-model="loginForm.password" placeholder="密码" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLoading" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" :offset="0" :xs="0"></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="login">
import { User, Lock } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { useUserStore } from '../../store/modules/user';
import { useRouter } from 'vue-router';
// elment提示框
import { ElNotification } from 'element-plus';
// 引入获取现在时间的方法
import { getTime } from '../../utils/time';

// 登录表单数据
let loginForm = reactive({
  username: 'admin',
  password: '111111'
})
// 自定义校验规则函数:rule为校验规则对象，value为表单的文本内容，callback为回调函数（符合时直接callback（）不符合则callback（错误信息））
// 用户名验证规则
const validatorUserName = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) { 
    callback();
  } else {
    callback(new Error('密码长度不能小于5位'));
  }
}
// 密码验证规则
const validatorPassWord = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) { 
    callback();
  } else {
    callback(new Error('密码长度不能小于5位'));
  }
}
// 登录表单验证规则
const rules = reactive({
  // 用户名验证规则,一个对象为一个验证规则，required为是否必填，message为提示信息，trigger为触发时机，blur为失去焦点时触发
  username: [
    { required: true, validator: validatorUserName, trigger: 'change' },
  ],
  // 密码验证规则
  password: [
    { required: true, validator: validatorPassWord, trigger: 'change' },
  ]
})
// 获取el-form组件实例
let loginFormRef = ref();
// 用户仓库
let userStore = useUserStore();
// 路由对象
let $router = useRouter();
// 登录按钮加载状态显示
let isLoading = ref(false);

// 登录按钮回调函数
const login = async () => {
  // 调用el-form组件的validate方法进行表单验证，返回一个promise对象
  // 如果验证通过，则执行登录操作
  await loginFormRef.value.validate()
  // 登录按钮显示加载状态
  isLoading.value = true
  // 登记登录后通知仓库发生登录请求，请求成功后跳转到首页，请求失败则弹出提示框
  try {
    // 登录成功时
    await userStore.userLogin(loginForm)
    // 登录成功后跳转到首页
    $router.push('/')
    // 登录成功后取消显示加载状态
    isLoading.value = false
    // 登录成功后弹出提示框
    ElNotification({
      title: `登录成功,${getTime()}好`,
      message: '欢迎回来',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    ElNotification().close()
    // 登录失败时
    // 取消显示加载状态
    isLoading.value = false
    ElNotification({
      title: '登录失败',
      message: (error as Error).message,
      type: 'error',
      duration: 3000
    })
  }
}

</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/backgroundImage.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  width: 100%;
  height: 100%;
  background-color: RGB(36, 172, 243);
  border-radius: 5px;
  position: relative;
  top: 30vh;
  text-align: center;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
}

h1 {
  color: white;
  font-size: 35px;
}

h2 {
  color: white;
  font-size: 25px;
  margin-top: 10px;
  margin-bottom: 15px;
}

.el-button {
  width: 100%;
  margin-bottom: 5px;
}

.el-input {
  width: 100%;
  text-align: left;
}
</style>