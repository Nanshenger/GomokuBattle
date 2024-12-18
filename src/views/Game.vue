<template>
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
            <el-button type="primary" @click="resetGame">Reset Game</el-button>
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
import { ref } from 'vue'
import UserCard from '@/components/UserCard.vue'
import { ElButton } from 'element-plus'

export default {
  name: 'Home',
  components: {
    UserCard,
    ElButton,
  },
  setup() {
    // 初始化棋盘
    const board = ref(Array(15).fill(null).map(() => Array(15).fill(null)))
    const currentPlayer = ref('X')  // 当前玩家 'X' 或 'O'

    const user1 = ref({ name: 'Alice', email: 'alice@example.com' })
    const user2 = ref({ name: 'Bob', email: 'bob@example.com' })
    const user3 = ref({ name: 'Coco', email: 'coco@example.com' })
    const user4 = ref({ name: 'Doge', email: 'doge@example.com' })

    // 处理点击事件
    const handleCellClick = (row, col) => {
      if (board.value[row][col] === null) { // 如果该位置为空
        board.value[row][col] = currentPlayer.value
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'  // 切换玩家
        checkWinner(row, col)  // 检查是否有玩家获胜
      }
    }

    // 检查胜利条件
    const checkWinner = (row, col) => {
      const player = board.value[row][col]
      if (
        checkDirection(row, col, 0, 1, player) ||  // 水平
        checkDirection(row, col, 1, 0, player) ||  // 垂直
        checkDirection(row, col, 1, 1, player) ||  // 主对角线
        checkDirection(row, col, 1, -1, player)    // 副对角线
      ) {
        alert(player + ' wins!')
      }
    }

    // 检查某一方向上是否有五个相同的棋子
    const checkDirection = (row, col, dRow, dCol, player) => {
      let count = 1
      // 检查前方
      for (let i = 1; i < 5; i++) {
        const newRow = row + dRow * i
        const newCol = col + dCol * i
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && board.value[newRow][newCol] === player) {
          count++
        } else {
          break
        }
      }
      // 检查后方
      for (let i = 1; i < 5; i++) {
        const newRow = row - dRow * i
        const newCol = col - dCol * i
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && board.value[newRow][newCol] === player) {
          count++
        } else {
          break
        }
      }
      return count >= 5
    }

    // 重置游戏
    const resetGame = () => {
      board.value = Array(15).fill(null).map(() => Array(15).fill(null))
      currentPlayer.value = 'X'
    }

    return {
      board,
      user1,
      user2,
      user3,
      user4,
      handleCellClick,
      resetGame,
    }
  }
}
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
</style>
