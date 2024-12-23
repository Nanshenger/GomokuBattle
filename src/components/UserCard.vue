<template>
  <div class="user-card">
    <h3>用户名: {{ user.name }}</h3>
    <p>用户邮箱: {{ user.email }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({ name: 'Guest', email: 'guest@example.com' }) // 设置默认值
    }
  },
}
</script>

<style scoped>
.user-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin: 15px 0;
  background: linear-gradient(145deg, #ffffff, #f3f3f3); /* 添加渐变背景色 */
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.7); /* 增加阴影 */
  transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.user-card:hover {
  transform: scale(1.02); /* 鼠标悬停时轻微放大 */
  box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.15), -6px -6px 15px rgba(255, 255, 255, 0.8); /* 增强悬停效果 */
}

.user-card h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
}

.user-card p {
  margin: 8px 0 0;
  font-size: 1rem;
  color: #666;
}

.user-card h3, .user-card p {
  text-align: center; /* 居中对齐 */
}
</style>
