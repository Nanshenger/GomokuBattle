<template>
  <!-- 引入全局导航栏 -->
  <NavBar />
  <!-- 渲染路由内容 -->
  <router-view></router-view> <!-- 这里是渲染路由内容的地方 -->
  <div class="common-layout">
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="300px">
        <div>
          <UserCard :user="user1" />
          <UserCard :user="user2" />
          <UserCard :user="user3" />
          <UserCard :user="user4" />
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
                <!-- 显示棋子 -->
                <div v-if="cell" :class="['piece', cell]"></div>
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="button-group">
            <el-button type="primary" @click="resetGame" :disabled="gameOver">Reset Game</el-button>
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
          <UserCard :user="user3" />
          <UserCard :user="user4" />
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import UserCard from '@/components/UserCard.vue'
import { ElButton } from 'element-plus'
import NavBar from '@/components/NavBar.vue'  // 引入 NavBar 组件

export default {
  name: 'Game',
  components: {
    UserCard,
    ElButton,
    NavBar,
  },
  setup() {
    const board = ref(Array(15).fill(null).map(() => Array(15).fill(null))); // 初始化棋盘
    const currentPlayer = ref('X');  // 当前玩家
    const winner = ref(null);  // 用于存储胜利者
    const gameOver = ref(false);  // 游戏是否结束
    const roomId = new URLSearchParams(window.location.search).get('room');  // 获取房间ID

    // WebSocket 连接到房间
    const ws = new WebSocket(`ws://localhost:3000/?room=${roomId}`);

    ws.onopen = () => {
      console.log('WebSocket 连接已打开');
    };

    // 处理服务器发送的消息
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'INIT_BOARD') {
        board.value = data.board;  // 初始化棋盘
      } else if (data.type === 'UPDATE_BOARD') {
        board.value = data.board;  // 更新棋盘
      } else if (data.type === 'VICTORY') {
        winner.value = data.winner;  // 设置胜利者
        gameOver.value = true;  // 设置游戏结束
      }
    };

    // 处理玩家点击棋盘
    const handleCellClick = (row, col) => {
      if (board.value[row][col] === null && !gameOver.value) { // 如果该位置为空，且游戏没有结束
        board.value[row][col] = currentPlayer.value;  // 更新棋盘
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';  // 切换玩家

        // 发送棋盘更新到服务器
        ws.send(JSON.stringify({
          type: 'MOVE',
          row,
          col,
          player: board.value[row][col],
        }));

        // 检查是否有胜利者
        checkWinner(row, col);
      }
    };

    // 检查胜利条件
    const checkWinner = (row, col) => {
      const player = board.value[row][col];
      if (
        checkDirection(row, col, 0, 1, player) ||  // 水平
        checkDirection(row, col, 1, 0, player) ||  // 垂直
        checkDirection(row, col, 1, 1, player) ||  // 主对角线
        checkDirection(row, col, 1, -1, player)    // 副对角线
      ) {
        winner.value = player;  // 设置胜利者
        gameOver.value = true;  // 游戏结束

        // 发送胜利消息到服务器
        ws.send(JSON.stringify({
          type: 'VICTORY',
          winner: player,
        }));
        alert(player + ' wins!');
      }
    };

    // 检查某一方向上是否有五个相同的棋子
    const checkDirection = (row, col, dRow, dCol, player) => {
      let count = 1;
      // 检查前方
      for (let i = 1; i < 5; i++) {
        const newRow = row + dRow * i;
        const newCol = col + dCol * i;
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && board.value[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      // 检查后方
      for (let i = 1; i < 5; i++) {
        const newRow = row - dRow * i;
        const newCol = col - dCol * i;
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && board.value[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      return count >= 5;
    };

    // 重置游戏
    const resetGame = () => {
      board.value = Array(15).fill(null).map(() => Array(15).fill(null));
      currentPlayer.value = 'X';
      winner.value = null;
      gameOver.value = false;

      // 发送重置游戏的消息
      ws.send(JSON.stringify({
        type: 'RESET_GAME',
      }));
    };

    return {
      board,
      currentPlayer,
      handleCellClick,
      resetGame,
      winner,
      gameOver,
    };
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
