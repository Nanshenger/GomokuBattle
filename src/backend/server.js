import express from 'express';
import { WebSocketServer } from 'ws'; // WebSocket 导入
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'; // 引入数据库模块

// 初始化 express 应用
const app = express();
const port = 3000; // HTTP 服务器端口
const roomBoards = {};  // 保存房间的棋盘信息

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 用户注册接口
app.post('/register', async (req, res) => {
    const { username, password, email, nickname, sex } = req.body;

    // 检查必填字段
    if (!username || !password || !email) {
        return res.status(400).json({ message: '用户名、密码和邮箱不能为空' });
    }

    // 检查用户名是否已存在
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        console.log('数据库查询结果:', rows);  // 输出查询结果

        if (rows.length > 0) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 插入新用户到数据库
        const [insertResult] = await db.execute(
            'INSERT INTO users (username, password, email, nickname, sex, permission_level) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, email, nickname, sex || 'unknown', 1]  // 默认性别为unknown，权限为1
        );

        console.log('插入结果:', insertResult);  // 输出插入结果

        // 返回成功响应
        res.status(201).json({ message: '注册成功' });
    } catch (err) {
        console.error('注册过程中发生错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 用户登录接口
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: '用户名不存在' });
        }

        const user = rows[0];

        // 直接比较密码（明文）
        if (user.password === password) {
            res.json({ success: true, message: '登录成功' });
        } else {
            res.json({ success: false, message: '密码错误' });
        }
    } catch (error) {
        console.error('数据库错误:', error);
        res.status(500).json({ message: '数据库错误' });
    }
});

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
            'INSERT INTO rooms (host_user_id) VALUES (?)',
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

// 创建 HTTP 服务器
const server = app.listen(port, () => {
    console.log(`HTTP 服务器正在运行: http://localhost:${port}`);
});

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, req) => {
    const roomId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('room');
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
                // 广播棋盘更新
                broadcastToRoom(roomId, { type: 'UPDATE_BOARD', board: roomBoards[roomId] });
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

// 绑定 WebSocket 到 HTTP 服务器
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        const roomId = new URL(request.url, `http://${request.headers.host}`).searchParams.get('room');
        ws.roomId = roomId;  // 保存房间ID，后续用来广播消息
        wss.emit('connection', ws, request);
    });
});
