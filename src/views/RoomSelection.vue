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
import axios from 'axios';
import { ElMessage } from "element-plus"; // 引入 axios 用于发送请求

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
    async joinRoom(roomId) {
      const userid = localStorage.getItem('userid');
      const response = await axios.post('http://localhost:3000/addRoom', { userid: userid, roomId: roomId });
      if (response.data.success) {
        console.log(`加入房间：${roomId}`);
        this.$router.push(`/game?room=${roomId}`); // 加入指定房间并跳转到游戏页面
      } else {
        ElMessage.error(response.data.message);
      }
    },
  },
};
</script>

<style scoped>
.room-selection-container {
  padding: 20px;
  background: linear-gradient(to bottom right, #e8f4ff, #d1e9fc);
  /* 渐变背景色 */
  min-height: 100vh;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  /* 增加内嵌阴影 */
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: linear-gradient(to right, #fefbfb, #e8f4ff);
  /* 渐变背景色 */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.room-header .title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.el-button {
  background: linear-gradient(to right, #d7e9f7, #a6c8ef); /* 浅蓝到柔和淡蓝渐变 */
  color: #2c3e50; /* 深蓝灰文字 */
  border: none;
  font-weight: 500;
  border-radius: 10px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 微弱阴影 */
  transition: background 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡 */
}

.el-button:hover {
  background: linear-gradient(to right, #c9e3f5, #94bde9); /* 略微高亮的蓝色渐变 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 悬停时增强阴影 */
  color: #536e87; /* 深蓝灰文字 */
  font-weight: 700; /* 加粗字体 */
}





.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.room-list .room-card {
  background: linear-gradient(to bottom right, #ffffff, #f0f8ff);
  /* 卡片背景渐变 */
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  /* 增加动态效果 */
}

.room-list .room-card:hover {
  transform: translateY(-5px);
  /* 鼠标悬停时上浮效果 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
