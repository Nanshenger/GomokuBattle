<template>
    <el-card class="room-card">
      <div class="room-info">
        <p><strong>房间号：</strong>{{ room.roomNumber }}</p>
        <p><strong>房主：</strong>{{ room.host }}</p>
        <p>
          <strong>玩家人数：</strong>{{ room.players }} / {{ room.maxPlayers }}
        </p>
      </div>
      <div class="room-actions">
        <el-button
          type="primary"
          size="small"
          :disabled="room.players >= room.maxPlayers"
          @click="$emit('joinRoom', room.id)"
        >
          加入房间
        </el-button>
      </div>
    </el-card>
  </template>
  
  <script>
  export default {
    name: "RoomCard",
    props: {
      room: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .room-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  
  .room-info {
    flex: 1;
  }
  
  .room-actions {
    display: flex;
    align-items: center;
  }
  </style>
  