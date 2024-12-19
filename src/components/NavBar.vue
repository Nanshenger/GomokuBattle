<template>
    <el-menu :default-active="activePath" class="navbar" mode="horizontal" background-color="#409EFF" text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/game" @click="handleClick('/game')">Game</el-menu-item>

        <!-- 登录和注册菜单项 -->
        <el-menu-item v-if="!isLoggedIn" index="/login" @click="handleClick('/login')">Login</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/register" @click="handleClick('/register')">Register</el-menu-item>

        <!-- 房间选择和个人资料菜单项 -->
        <el-menu-item v-if="isLoggedIn" index="/roomselection" @click="handleClick('/roomselection')">Room
            Selection</el-menu-item>
        <el-menu-item v-if="isLoggedIn" index="/profile" @click="handleClick('/profile')">Profile</el-menu-item>

        <!-- 显示当前用户名和登出按钮 -->
        <el-menu-item v-if="isLoggedIn" @click="logout">
            {{ username }} (Logout) <!-- 显示当前用户名 -->
        </el-menu-item>
    </el-menu>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMenu, ElMenuItem } from 'element-plus';

export default defineComponent({
    name: 'NavBar',
    components: {
        ElMenu,
        ElMenuItem
    },
    setup() {
        const router = useRouter();
        const activePath = ref('/');

        // 计算是否已登录
        const isLoggedIn = computed(() => !!localStorage.getItem('username'));

        // 计算当前用户名
        const username = computed(() => localStorage.getItem('username') || 'Guest');

        const handleClick = (path) => {
            activePath.value = path;
            router.push(path);
        };

        const logout = () => {
            localStorage.removeItem('username'); // 清除登录信息
            router.push('/login'); // 跳转到登录页面
        };

        return {
            activePath,
            handleClick,
            isLoggedIn,
            username, // 返回计算出的用户名
            logout
        };
    }
});
</script>

<style scoped>
.navbar {
    margin: 0;
    padding: 0;
    border: none;
}

.el-menu {
    border-radius: 4px;
}

.el-menu-item {
    font-size: 16px;
    padding: 15px 25px;
}

.el-menu-item:hover {
    background-color: #66b1ff;
}
</style>