import express from 'express';
import { WebSocketServer } from 'ws'; // WebSocket 导入
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'; // 引入数据库模块
import login from './login.js';  // 引入 login 路由
import register from './register.js';  // 引入 register 路由

// 初始化 express 应用
const app = express();
const port = 3000; // HTTP 服务器端口
const roomBoards = {};  // 保存房间的棋盘信息

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 使用 login 和 register 路由
app.use('/login', login);  // 将 login 路由挂载到 /login
app.use('/register', register);  // 将 register 路由挂载到 /register

// 获取房间列表接口
app.get('/rooms', async (req, res) => {
    try {
        // 更新状态为 'finished' 的房间（如果超过10分钟）
        await db.execute(`
            UPDATE rooms 
            SET room_status = 'finished' 
            WHERE room_status = 'waiting' 
            AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 10
        `);

        // 查询房间列表，排除已经是 'finished' 的房间
        const [rows] = await db.execute(`
            SELECT rooms.room_id, rooms.room_status, rooms.created_at, users.username AS host
            FROM rooms
            JOIN users ON rooms.host_user_id = users.userid
            WHERE rooms.room_status != 'finished'
        `);

        res.json(rows); // 返回房间列表
    } catch (error) {
        console.error('获取房间列表失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 创建房间接口
app.post('/rooms', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: '用户名不能为空' });
    }

    try {
        // 获取用户ID
        const [userRows] = await db.execute('SELECT userid FROM users WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: '用户不存在' });
        }

        const userId = userRows[0].userid;

        // 插入新房间到数据库
        const [insertResult] = await db.execute(
            'INSERT INTO rooms (host_user_id, player_count) VALUES (?, 1)',
            [userId]
        );

        // 初始化棋盘
        const board = Array(15).fill(null).map(() => Array(15).fill(null));
        roomBoards[insertResult.insertId] = board;  // 将棋盘存入 roomBoards

        // 返回创建的房间信息
        const [roomRows] = await db.execute(
            'SELECT room_id, host_user_id FROM rooms WHERE room_id = ?',
            [insertResult.insertId]
        );

        res.status(201).json(roomRows[0]); // 返回新创建的房间信息
    } catch (error) {
        console.error('创建房间失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

app.post("/addRoom", async (req, res) => {
    const { userid, roomId } = req.body;
    try {
        const [result] = await db.execute(
            `SELECT player_count, room_status FROM rooms WHERE room_id = ?`,
            [roomId]
        );
        const playerCount = result[0].player_count;
        const roomStatus = result[0].room_status;
        if (roomStatus === 'finished') {
            return res.json({ success: false, message: '房间已关闭，无法加入...' });
        }
        if (playerCount === 2) {
            return res.json({ success: false, message: '房间人满，无法加入....' });
        }
        // 修改房间人数
        await db.execute(
            `update rooms SET player_count = ?, room_status = 'playing', player_id = ? WHERE room_id = ?`,
            [playerCount + 1, userid, roomId]
        )
        return res.json({ success: true });
    } catch (err) {
        console.error('玩家' + userid + + '，加入房间失败:', err.message);
        res.json({ success: false, message: '服务错误' });
    }
})

// 创建 HTTP 服务器
const server = app.listen(port, () => {
    console.log(`HTTP 服务器正在运行: http://localhost:${port}`);
});

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (ws, req) => {
    const searchParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const roomId = searchParams.get('room');
    const userid = searchParams.get('userid');

    // 验证房间是否存在，用户是否有权限连接
    const [result] = await db.execute(`SELECT * FROM rooms WHERE room_id = ?`, [roomId]);
    if (result.length === 0) {
        ws.send(JSON.stringify({ type: 'ConnectionDenial', message: '房间号不存在' }));
        return;
    }
    const playerId = result[0].player_id;
    const hostUserId = result[0].host_user_id;
    if (userid != hostUserId && userid != playerId) {
        ws.send(JSON.stringify({ type: 'ConnectionDenial', message: '拒绝连接' }));
        return;
    }

    console.log(`客户端已连接到房间: ${roomId}`);

    // 将当前房间的棋盘信息发送给客户端
    if (roomBoards[roomId]) {
        ws.send(JSON.stringify({ type: 'INIT_BOARD', board: roomBoards[roomId] }));
    }

    // 监听来自客户端的棋盘更新消息
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'MOVE') {
            // 更新棋盘状态
            if (roomBoards[roomId]) {
                roomBoards[roomId][data.row][data.col] = data.player;

                // 判断是否有胜利者
                const winner = checkWinner(roomId, data.row, data.col, data.player);
                if (winner) {
                    // 广播胜利信息
                    broadcastToRoom(roomId, { type: 'VICTORY', winner });
                    return;
                }

                // 广播棋盘更新
                broadcastToRoom(roomId, { type: 'UPDATE_BOARD', board: roomBoards[roomId] });
            }
        }
        if (data.type === 'RESET_GAME') {
            // 重置棋盘
            if (roomBoards[roomId]) {
                roomBoards[roomId] = Array(15).fill(null).map(() => Array(15).fill(null));
                broadcastToRoom(roomId, { type: 'RESTART', board: roomBoards[roomId] });
            }
        }
    });

    // WebSocket 关闭时，移除该连接
    ws.on('close', () => {
        console.log(`房间: ${roomId} 的客户端已断开连接`);
    });
});

// 房间更新广播
function broadcastToRoom(roomId, message) {
    wss.clients.forEach((client) => {
        if (client.roomId === roomId && client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// 胜利判断函数
function checkWinner(roomId, row, col, player) {
    if (!roomBoards[roomId]) return null;
    const directions = [
        [0, 1], // 水平
        [1, 0], // 垂直
        [1, 1], // 主对角线
        [1, -1] // 副对角线
    ];

    for (let [dRow, dCol] of directions) {
        let count = 1; // 计数当前方向上连续的棋子数量

        // 检查前方
        for (let i = 1; i < 5; i++) {
            const newRow = row + dRow * i;
            const newCol = col + dCol * i;
            if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && roomBoards[roomId][newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        // 检查后方
        for (let i = 1; i < 5; i++) {
            const newRow = row - dRow * i;
            const newCol = col - dCol * i;
            if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && roomBoards[roomId][newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            return player; // 找到胜利者
        }
    }

    return null; // 没有胜利者
}

// 绑定 WebSocket 到 HTTP 服务器
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        const roomId = new URL(request.url, `http://${request.headers.host}`).searchParams.get('room');
        ws.roomId = roomId;  // 保存房间ID，后续用来广播消息
        wss.emit('connection', ws, request);
    });
});
