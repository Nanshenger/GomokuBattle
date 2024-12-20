<template>
  <!-- 引入全局导航栏 -->
  <!-- <NavBar /> -->
  <!-- 渲染路由内容 -->
  <router-view></router-view> <!-- 这里是渲染路由内容的地方 -->
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登录</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" show-password type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="text" @click="toRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'; // 引入 axios
import { ElMessage } from 'element-plus';
import NavBar from '@/components/NavBar.vue'  // 引入 NavBar 组件
export default {

  name: "LoginPage",
  components: {
    NavBar,
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            // 向后端发送登录请求
            const response = await axios.post('http://localhost:3000/login', {
              username: this.loginForm.username,
              password: this.loginForm.password,
            });
            if (response.data.success) {
              ElMessage.success("登录成功");
              // 保存用户名到 localStorage
              localStorage.setItem("username", this.loginForm.username);
              localStorage.setItem("userid", response.data.data.userid);
              // 跳转到选择房间页面
              this.$router.push("/roomselection");
            } else {
              ElMessage.error(response.data.message || "用户名或密码错误");
            }
          } catch (error) {
            ElMessage.error("登录失败，请稍后重试");
            console.error("登录错误：", error);
          }
        } else {
          ElMessage.error("请完善登录信息");
        }
      });
    }
    ,
    toRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
