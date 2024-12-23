<template>
  <el-card class="room-card">
    <div class="room-info">
      <p><strong>房间号：</strong>{{ room.room_id }}</p> <!-- 显示房间号 -->
      <p><strong>房主：</strong>{{ room.host }}</p> <!-- 显示房主 -->
      <p>
        <strong>房间状态：</strong>等待中...
      </p>
    </div>
    <div class="room-actions">
      <el-button type="primary" size="small" :disabled="room.players >= room.maxPlayers"
        @click="$emit('joinRoom', room.room_id)"> 加入房间
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
  padding: 20px;
  margin: 10px 0;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.room-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.room-info {
  flex: 1;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.room-info p {
  margin: 5px 0;
}

.room-actions {
  display: flex;
  align-items: center;
}

.room-actions .el-button {
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.room-actions .el-button:disabled {
  background-color: #dcdfe6;
  color: #c0c4cc;
}

.room-actions .el-button:hover:not(:disabled) {
  background-color: #66b1ff;
}
</style>
