<template>
    <el-menu :default-active="activePath" class="navbar" mode="horizontal" background-color="#409EFF" text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/game" @click="handleClick('/game')">Game</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/login" @click="handleClick('/login')">Login</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/register" @click="handleClick('/register')">Register</el-menu-item>
        <el-menu-item v-if="isLoggedIn" index="/roomselection" @click="handleClick('/roomselection')">Room
            Selection</el-menu-item>
        <el-menu-item v-if="isLoggedIn" index="/profile" @click="handleClick('/profile')">Profile</el-menu-item>
        <el-menu-item v-if="isLoggedIn" @click="logout">Logout</el-menu-item>
    </el-menu>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
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

        // 设置组件的 key，使组件可以通过 key 变化强制重渲染
        const navbarKey = ref(Date.now());


        const handleClick = (path) => {
            activePath.value = path;
            router.push(path);
        };

        const logout = () => {
            localStorage.removeItem('username'); // 清除登录信息
            // 跳转到登录页面并强制刷新
            location.reload(); // 刷新页面
            router.push('/login'); // 跳转到登录页面
        };

        return {
            activePath,
            handleClick,
            isLoggedIn,
            navbarKey,  // 传递 key 给组件，强制更新
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