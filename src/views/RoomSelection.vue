<template>
    <div class="room-selection-container">
      <el-card class="room-header">
        <h2 class="title">选择房间</h2>
        <el-button type="primary" @click="createRoom">创建房间</el-button>
      </el-card>
      <div class="room-list">
        <RoomCard
          v-for="room in rooms"
          :key="room.id"
          :room="room"
          @joinRoom="joinRoom"
        />
      </div>
    </div>
  </template>
  
  <script>
  import RoomCard from "../components/RoomCard.vue";
  
  export default {
    name: "RoomSelection",
    components: { RoomCard },
    data() {
      return {
        rooms: [
          {
            id: 1,
            roomNumber: "101",
            host: "张三",
            players: 2,
            maxPlayers: 2,
          },
          {
            id: 2,
            roomNumber: "102",
            host: "李四",
            players: 1,
            maxPlayers: 2,
          },
          {
            id: 2,
            roomNumber: "102",
            host: "李四",
            players: 1,
            maxPlayers: 2,
          },
          {
            id: 2,
            roomNumber: "102",
            host: "李四",
            players: 1,
            maxPlayers: 2,
          },
          
        ],
      };
    },
    methods: {
      createRoom() {
        this.$router.push("/game?create=true"); // 创建房间并跳转到游戏页面
      },
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
  