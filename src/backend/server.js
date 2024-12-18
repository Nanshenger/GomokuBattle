import express from 'express';
import { WebSocketServer } from 'ws'; // WebSocket 导入
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'; // 引入数据库模块

// 初始化 express 应用
const app = express();
const port = 3000; // HTTP 服务器端口

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


// 创建 HTTP 服务器
const server = app.listen(port, () => {
    console.log(`HTTP 服务器正在运行: http://localhost:${port}`);
});

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('客户端 WebSocket 连接成功');

    // 接收客户端消息
    ws.on('message', (message) => {
        console.log('收到消息:', message);
    });

    // 发送欢迎消息
    ws.send('欢迎连接到五子棋游戏服务器！');
});

// 绑定 WebSocket 到 HTTP 服务器
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
