<template>
    <!-- 引入全局导航栏 -->
    <NavBar />
    <!-- 渲染路由内容 -->
    <router-view></router-view> <!-- 这里是渲染路由内容的地方 -->
    <div class="profile-container">
        <el-card class="profile-card">
            <h2 class="profile-title">个人资料</h2>
            <el-form :model="profileForm" label-width="100px" class="profile-form">
                <el-form-item label="用户名">
                    <el-input v-model="profileForm.username" :disabled="!isEditing" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="profileForm.email" :disabled="!isEditing" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="profileForm.nickname" :disabled="!isEditing" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="profileForm.sex" :disabled="!isEditing">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="对战统计">
                    <div class="stats">
                        <p>胜率: {{ profileForm.winRate }}%</p>
                        <p>对战场次: {{ profileForm.matches }}</p>
                        <p>胜利场次: {{ profileForm.wins }}</p>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-if="!isEditing" @click="enableEdit">
                        编辑资料
                    </el-button>
                    <el-button type="success" v-if="isEditing" @click="saveProfile">
                        保存
                    </el-button>
                    <el-button type="text" v-if="isEditing" @click="cancelEdit">
                        取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import NavBar from '@/components/NavBar.vue'; // 引入 NavBar 组件

export default {
    name: "Profile",
    components: {
        NavBar,
    },
    data() {
        return {
            isEditing: false,
            profileForm: {
                username: "",
                email: "",
                nickname: "",
                sex: "未知",
                winRate: 0,
                matches: 0,
                wins: 0,
            },
        };
    },
    mounted() {
        this.fetchProfileData(); // 页面加载时获取用户资料
    },
    methods: {
        fetchProfileData() {
            const userid = localStorage.getItem("userid"); // 从 localStorage 中读取 userid

            if (!userid) {
                console.error("用户ID不存在，请先登录");
                ElMessage.error("请先登录");
                return;
            }

            fetch("http://localhost:3000/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid }), // 发送 userid 到服务端
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const { username, email, nickname, sex, games_played, games_won } = data.data;
                        const winRate = games_played > 0 ? Math.round((games_won / games_played) * 100) : 0;
                        this.profileForm = {
                            username,
                            email,
                            nickname,
                            sex,
                            winRate,
                            matches: games_played,
                            wins: games_won,
                        };
                    } else {
                        console.error(data.message);
                        ElMessage.error(data.message);
                    }
                })
                .catch((error) => {
                    console.error("加载资料失败:", error);
                    ElMessage.error("加载资料失败，请稍后重试");
                });
        },
        enableEdit() {
            this.isEditing = true;
        },
        saveProfile() {
            this.isEditing = false;
            ElMessage.success("资料保存成功");
            console.log("保存资料：", this.profileForm);
        },
        cancelEdit() {
            this.isEditing = false;
            console.log("取消编辑");
        },
    },
};
</script>

<style scoped>
.profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.profile-card {
    width: 500px;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.profile-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
}

.profile-form {
    font-size: 14px;
    color: #606266;
}

.el-form-item {
    margin-bottom: 20px;
}

.stats p {
    margin: 5px 0;
    font-size: 14px;
    color: #409eff;
}

.el-button {
    margin-right: 10px;
    border-radius: 8px;
}

.el-button[type="primary"] {
    background-color: #409eff;
    color: #fff;
}

.el-button[type="success"] {
    background-color: #67c23a;
    color: #fff;
}

.el-button[type="text"] {
    color: #909399;
}
</style>