<template>
  <!-- 引入全局导航栏 -->
  <NavBar />
  <!-- 渲染路由内容 -->
  <router-view></router-view> <!-- 这里是渲染路由内容的地方 -->
  <div class="room-selection-container">
    <el-card class="room-header">
      <h2 class="title">选择房间</h2>
      <el-button type="primary" @click="createRoom">创建房间</el-button>
    </el-card>
    <div class="room-list">
      <RoomCard v-for="room in rooms" :key="room.room_id" :room="room" @joinRoom="joinRoom" />
    </div>
  </div>
</template>

<script>
import RoomCard from "../components/RoomCard.vue";
import NavBar from '@/components/NavBar.vue';  // 引入 NavBar 组件
import axios from 'axios'; // 引入 axios 用于发送请求

export default {
  name: "RoomSelection",
  components: {
    RoomCard,
    NavBar,
  },
  data() {
    return {
      rooms: [], // 初始化房间列表为空
    };
  },
  created() {
    this.fetchRooms(); // 页面创建时请求房间列表
  },
  methods: {
    // 获取房间列表
    async fetchRooms() {
      try {
        const response = await axios.get('http://localhost:3000/rooms'); // 请求房间列表
        this.rooms = response.data; // 更新房间列表
      } catch (error) {
        console.error("获取房间列表失败:", error);
      }
    },

    // 创建房间
    async createRoom() {
      const username = localStorage.getItem('username'); // 获取当前用户名

      try {
        const response = await axios.post('http://localhost:3000/rooms', { username });
        console.log("房间创建成功:", response.data);

        const roomId = response.data.room_id;  // 获取新创建房间的 ID

        // 跳转到新创建的房间
        this.$router.push(`/game?room=${roomId}`);
      } catch (error) {
        console.error("创建房间失败:", error);
      }
    }
    ,

    // 加入房间
    joinRoom(roomId) {
      console.log(`加入房间：${roomId}`);
      this.$router.push(`/game?room=${roomId}`); // 加入指定房间并跳转到游戏页面
    },
  },
};
</script>

<style scoped>
.room-selection-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>
