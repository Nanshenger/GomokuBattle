<template>
  <!-- 引入全局导航栏 -->
  <NavBar />

  <div class="common-layout">
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="300px">
        <div>
          <UserCard :user="{ name: username, email: email }" />
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

      <!-- 右侧侧边栏 -->
      <el-aside width="300px">
        <div>
          <UserCard :user="user1" />
          <UserCard :user="user2" />
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

    const ws = new WebSocket(`ws://localhost:3000/?userid=${userid}&room=${roomId}`);

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

    return { board, currentPlayer, handleCellClick, winner, gameOver, resetGame, username, email, router};
  },
};
</script>



<style scoped>
.common-layout {
  display: flex;
  height: 100vh;
}

.el-aside {
  background-color: #f4f4f4;
}

.chessboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chessboard {
  display: flex;
  flex-direction: column;
  border: 2px solid #000;
}

.row {
  display: flex;
}

.cell {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  cursor: pointer;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.piece {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.piece.X {
  background-color: black;
  /* 黑色棋子 */
  border: 2px solid black;
  /* 白色棋子加上黑色边框 */
}

.piece.O {
  background-color: white;
  /* 白色棋子 */
  border: 2px solid black;
  /* 白色棋子加上黑色边框 */
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.winner-message {
  text-align: center;
  margin-top: 20px;
  color: green;
}
</style>
