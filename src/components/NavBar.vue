<template>
    <el-menu :default-active="activePath" class="navbar" mode="horizontal" background-color="#409EFF" text-color="#fff"
        active-text-color="#ffd04b">
        <!-- <el-menu-item index="/game" @click="handleClick('/game')">游 戏</el-menu-item> -->

        <!-- 登录和注册菜单项 -->
        <el-menu-item v-if="!isLoggedIn" index="/login" @click="handleClick('/login')">登 录</el-menu-item>
        <el-menu-item v-if="!isLoggedIn" index="/register" @click="handleClick('/register')">注 册</el-menu-item>

        <!-- 游戏介绍界面 -->
        <el-menu-item v-if="isLoggedIn" index="/about" @click="handleClick('/about')">关 于</el-menu-item>

        <!-- 房间选择和个人资料菜单项 -->
        <el-menu-item v-if="isLoggedIn" index="/roomselection"
            @click="handleClick('/roomselection')">房间选择</el-menu-item>
        <el-menu-item v-if="isLoggedIn" index="/profile" @click="handleClick('/profile')">个人资料</el-menu-item>

        <!-- 显示当前用户名和登出按钮 -->
        <el-menu-item v-if="isLoggedIn" @click="logout">
            {{ username }} (登出) <!-- 显示当前用户名 -->
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
    padding: 5px 0;
    /* 降低导航栏整体高度 */
    border: none;
    background: linear-gradient(90deg, #409EFF, #66b1ff);
    /* 渐变背景 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* 添加阴影 */
    border-radius: 8px;
    /* 圆角边框 */
}

.el-menu {
    border-radius: 8px;
    transition: all 0.3s ease;
    /* 添加平滑动画效果 */
}

.el-menu-item {
    font-size: 16px;
    font-weight: 500;
    padding: 15px 25px;
    color: white;
    transition: background-color 0.3s ease, transform 0.3s ease;
    /* 平滑过渡动画 */
}

.el-menu-item:hover {
    background-color: #66b1ff;
    transform: scale(1.1);
    /* 鼠标悬停时微微放大 */
    border-radius: 4px;
    /* 悬停时增加视觉反馈 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* 增强悬停效果 */
}

.el-menu-item[aria-current="page"] {
    background-color: #ffd04b;
    /* 当前页面项高亮 */
    color: #34495e;
    /* 更深的文字颜色 */
    font-weight: bold;
    /* 突出显示 */
    border-radius: 6px;
    /* 高亮项的圆角更明显 */
}
</style>
