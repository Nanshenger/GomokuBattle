// Profile.vue
<template>
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
                    <el-radio-group v-model="profileForm.gender" :disabled="!isEditing">
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

export default {
    name: "Profile",
    data() {
        return {
            isEditing: false,
            profileForm: {
                username: "guest",
                email: "guest@example.com",
                nickname: "小明",
                gender: "男",
                winRate: 75,
                matches: 40,
                wins: 30,
            },
        };
    },
    methods: {
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
    background-color: #f5f5f5;
}

.profile-card {
    width: 500px;
    padding: 20px;
}

.profile-title {
    text-align: center;
    margin-bottom: 20px;
}

.stats p {
    margin: 5px 0;
}
</style>