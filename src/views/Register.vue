<template>
  <!-- 引入全局导航栏 -->
  <!-- <NavBar /> -->
  <!-- 渲染路由内容 -->
  <router-view></router-view> <!-- 这里是渲染路由内容的地方 -->
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">GomokuBattle - 注册</h2>
      <br>
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" placeholder="请输入密码" show-password type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" placeholder="请再次输入密码" show-password type="password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="registerForm.sex" placeholder="请选择性别">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
            <el-option label="保密" value="unknown" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">注册</el-button>
          <el-button type="text" @click="toLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';  // 引入消息提示
import axios from 'axios'; // 引入 axios
import NavBar from '@/components/NavBar.vue'  // 引入 NavBar 组件
export default {
  name: "RegisterPage",
  components: {
    NavBar,
  },
  data() {
    return {
      // 注册表单数据
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "1234567890@qq.com",
        nickname: "",
        sex: "unknown",  // 默认性别
      },
      // 注册表单验证规则
      registerRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: this.validateConfirmPassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 提交注册表单
    async onSubmit() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            // 发送注册请求
            const response = await axios.post('http://localhost:3000/register', {
              username: this.registerForm.username,
              password: this.registerForm.password,
              email: this.registerForm.email,
              nickname: this.registerForm.nickname,
              sex: this.registerForm.sex,
            });
            // 注册成功提示
            ElMessage.success(response.data.message);
            // 跳转到登录页面
            this.$router.push("/login");
          } catch (error) {
            // 请求失败提示
            ElMessage.error(error.response?.data?.message || '注册失败，请稍后再试');
          }
        } else {
          // 表单验证失败提示
          ElMessage.error("请完善注册信息");
        }
      });
    },
    // 返回登录页面
    toLogin() {
      this.$router.push("/login");
    },
    // 自定义确认密码校验
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.registerForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #a6c8ef, #d7e9f7);
  /* 渐变背景，浅蓝到淡蓝 */
}

.register-card {
  width: 400px;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  /* 卡片阴影效果 */
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  /* 深蓝字体颜色 */
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  border-radius: 8px;
  background-color: #f7f7f7;
}

.el-button {
  background: linear-gradient(to right, #a6c8ef, #69b7eb);
  /* 蓝色渐变 */
  color: white;
  border: none;
  font-weight: 600;
  /* 加粗字体 */
  border-radius: 8px;
  padding: 10px 20px;
  transition: background 0.3s ease, transform 0.3s ease;
  /* 平滑过渡 */
}

.el-button:hover {
  background: linear-gradient(to right, #69b7eb, #3c8dff);
  /* 鼠标悬停时稍微加深的蓝色渐变 */
  transform: scale(1.05);
  /* 放大效果 */
}

.el-button[type="text"] {
  color: #4f6d7a;
  /* 淡灰蓝色 */
  font-weight: 500;
  padding: 0;
  text-decoration: underline;
}

.el-button[type="text"]:hover {
  color: #2c3e50;
  /* 鼠标悬停时加深字体颜色 */
}
</style>
