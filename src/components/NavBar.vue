<template>
    <el-menu :default-active="activePath" class="navbar" mode="horizontal" background-color="#409EFF" text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/" @click="handleClick('/')">Game</el-menu-item>
        <el-menu-item index="/login" @click="handleClick('/login')">login</el-menu-item>
        <el-menu-item index="/register" @click="handleClick('/register')">register</el-menu-item>
        <el-menu-item index="/roomselection" @click="handleClick('/roomselection')">roomselection</el-menu-item>
        <el-menu-item index="/profile" @click="handleClick('/profile')">profile</el-menu-item>

    </el-menu>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'
import { useRouter } from 'vue-router'  // 引入 vue-router

export default defineComponent({
    name: 'NavBar',
    components: {
        ElMenu,
        ElMenuItem
    },
    setup() {
        const router = useRouter()  // 获取 Vue Router 实例
        const activePath = ref('/')

        const handleClick = (path) => {
            activePath.value = path
            router.push(path)  // 使用 router.push 进行页面跳转
        }

        return {
            activePath,
            handleClick
        }
    }
})
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