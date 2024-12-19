<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="greetUser">Say Hello</button>
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
  methods: {
    greetUser() {
      alert(`Hello, ${this.user.name}!`);
    }
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 10px;
  border-radius: 8px;
}
</style>
