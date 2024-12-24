<template>
  <!-- 引入全局导航栏 -->
  <NavBar />

  <div class="common-layout">
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="300px">
        <div>
          <UserCard :user="user1" />
          <UserCard :user="user2" />
        </div>
      </el-aside>

      <!-- 中间内容区域，包含棋盘 -->
      <el-main>
        <div class="chessboard-container">
          <!-- 棋盘 -->
          <div class="chessboard">
            <div v-for="(row, rowIndex) in board" :key="'row-' + rowIndex" class="row">
              <div v-for="(cell, colIndex) in row" :key="'col-' + colIndex" class="cell" :class="cell"
                @click="handleCellClick(rowIndex, colIndex)">
                <div v-if="cell" :class="['piece', cell]"></div>
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="button-group">
            <!-- 只有游戏结束后才能重置游戏(ps: 现在已经搁置了这个重置因为有点bug) -->
            <!-- <el-button type="primary" @click="resetGame" :disabled="!gameOver">Reset Game</el-button> -->
            <!-- 退出游戏按钮 -->
            <el-button type="primary" @click="router.push('/roomselection')" :disabled="!gameOver">退出游戏</el-button>

          </div>

          <!-- 显示胜利信息 -->
          <div v-if="gameOver" class="winner-message">
            <h2>{{ winner }} wins!</h2>
          </div>
        </div>
      </el-main>

      <el-aside width="300px">
        <div class="chat-box">
          <!-- 打招呼按钮 -->
          <div class="chat-actions">
            <el-button type="primary" @click="sendGreeting">打招呼</el-button>
          </div>
          <br>
          <!-- 消息区域 -->
          <div class="messages">
            <div v-for="(message, index) in messages" :key="index" class="message">
              {{ message }}
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { onUnmounted, ref } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import NavBar from '@/components/NavBar.vue';
import router from '@/router';
import UserCard from '@/components/UserCard.vue';

export default {
  name: 'Game',
  components: { UserCard, NavBar },
  setup() {
    const board = ref(Array(15).fill(null).map(() => Array(15).fill(null)));
    const currentPlayer = ref('X');
    const winner = ref(null);
    const gameOver = ref(false);
    const roomId = new URLSearchParams(window.location.search).get('room');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username') || 'Guest'; // 获取localStorage中的用户名，默认值为'Guest'
    const email = localStorage.getItem('email') || 'example@example.com'; // 获取localStorage中的邮箱
    const messages = ref([]); // 用于存储聊天消息

    const ws = new WebSocket(`ws://localhost:3000/?userid=${userid}&room=${roomId}`);

    // 初始化 user1 和 user2 为响应式对象
    const user1 = ref({
      name: '',
      email: ''
    });
    const user2 = ref({
      name: '',
      email: ''
    });
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'INIT_BOARD' || data.type === 'UPDATE_BOARD') {
        board.value = data.board;
      } else if (data.type === 'VICTORY') {
        winner.value = data.winner;
        gameOver.value = true;
      } else if (data.type === 'ConnectionDenial') {
        router.push("/roomselection");
        ElMessage.error(data.message);
      } else if (data.type === 'GAME_TAG') {
        ElMessage.error(data.message);
      } else if (data.type === 'Player_Info') {
        user1.value.name = data.playerXName;
        user1.value.email = data.playerXEmail;
        user2.value.name = data.playerYName;
        user2.value.email = data.playerYEmail;
      } else if (data.type === 'CHAT_MESSAGE') {
        messages.value.push(data.message); // 接收聊天消息并添加到消息数组
      }
    };

    const handleCellClick = (row, col) => {
      if (board.value[row][col] === null && !gameOver.value) {
        ws.send(JSON.stringify({
          type: 'MOVE',
          row,
          col,
          player: userid,
        }));
      }
    };

    // 新增：发送固定消息的函数
    const sendGreeting = () => {
      const greetingMessage = `${username}：你好！`; // 固定的问候消息
      ws.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        sender: localStorage.getItem('userid'),
        message: greetingMessage,
      }));
    };


    const resetGame = () => {
      // 重置棋盘
      board.value = Array(15).fill(null).map(() => Array(15).fill(null));
      currentPlayer.value = 'X'; // 重置为玩家X先行
      winner.value = null; // 清空胜利者
      gameOver.value = false; // 设置游戏未结束

      // 发送重置请求给服务器
      ws.send(JSON.stringify({
        type: 'RESET_GAME',
      }));
    };

    onUnmounted(() => {
      ws.close();
    });

    return { board, currentPlayer, handleCellClick, winner, gameOver, resetGame, username, email, router, user1, user2, messages, sendGreeting };
  },
};
</script>



<style scoped>
.common-layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(to bottom, #e8f4ff, #d1e9fc);
}

.el-aside {
  background-color: #f8fafc;
  border-right: 1px solid #e0e6ed;
  padding: 20px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.chessboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 94%;
  background: linear-gradient(135deg, #ffffff, #f0f4f8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
}

.chessboard {
  display: flex;
  flex-direction: column;
  border: 3px solid #34495e;
  border-radius: 8px;
  background-color: #ecf0f1;
}

.row {
  display: flex;
}

.cell {
  width: 40px;
  height: 40px;
  border: 1px solid #bdc3c7;
  cursor: pointer;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.2s ease;
}

.cell:hover {
  background-color: #d5e6f3;
}

.piece {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.piece.X {
  background-color: #2c3e50;
}

.piece.O {
  background-color: #ecf0f1;
  border: 2px solid #2c3e50;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.winner-message {
  text-align: center;
  margin-top: 20px;
  color: #27ae60;
  font-size: 1.5em;
  font-weight: bold;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 90%;
  padding: 20px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background: #f7faff;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
}

.message {
  margin: 8px 0;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #e8f4ff;
}

.chat-actions {
  text-align: center;
}
</style>
