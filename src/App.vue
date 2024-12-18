<template>
  <div id="app">
    <!-- 引入全局导航栏 -->
    <NavBar />

    <!-- 渲染路由内容 -->
    <router-view></router-view> <!-- 这里是渲染路由内容的地方 -->
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'  // 引入 NavBar 组件

export default {
  name: 'App',
  components: {
    NavBar  // 注册 NavBar 组件
  }
}
</script>

<style>
/* 可以在这里添加全局样式 */
</style>
