import express from 'express';
import { WebSocketServer } from 'ws'; // WebSocket 导入
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js'; // 引入数据库模块
import login from './login.js';  // 引入 login 路由
import register from './register.js';  // 引入 register 路由
import profile from './profile.js';  // 引入 profile 路由

// 初始化 express 应用
const app = express();
const port = 3000; // HTTP 服务器端口

const roomList = new Map();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 使用 login 和 register 路由
app.use('/login', login);  // 将 login 路由挂载到 /login
app.use('/register', register);  // 将 register 路由挂载到 /register
app.use('/profile', profile);  // 资料读取路由

// 获取房间列表接口
app.get('/rooms', async (req, res) => {
    try {
        // 更新状态为 'finished' 的房间（如果超过10分钟）, 游玩超过600分钟也会强制关闭房间
        await db.execute(`
            UPDATE rooms 
            SET room_status = 'finished' 
            WHERE room_status = 'waiting' 
            AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 10
        `);

        await db.execute(`
            UPDATE rooms 
            SET room_status = 'finished' 
            WHERE room_status = 'playing' 
            AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 600
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

        // 返回创建的房间信息
        const [roomRows] = await db.execute(
            'SELECT room_id, host_user_id FROM rooms WHERE room_id = ?',
            [insertResult.insertId]
        );

        // 将房间信息存入系统 先手默认房主
        var room = { playerX: '', playerY: '', playerCount: 0, roomId: 0, boards: {}, playing: userId, matchId: 0 };
        room.playerX = roomRows[0].host_user_id;
        room.roomId = roomRows[0].room_id
        room.playerCount = 1;

        // 初始化棋盘
        const board = Array(15).fill(null).map(() => Array(15).fill(null));
        room.boards = board;  // 将棋盘存入 roomBoards

        roomList.set(Number(room.roomId), room);

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
            `SELECT *
             FROM rooms
             WHERE room_id = ?`,
            [roomId]
        );
        const hostUserId = result[0].host_user_id;
        const playerId = result[0].player_id;
        const playerCount = result[0].player_count;
        const roomStatus = result[0].room_status;
        if (roomStatus === 'finished') {
            return res.json({ success: false, message: '房间已关闭，无法加入...' });
        }
        if (hostUserId != userid && userid != playerId && playerCount === 2) {
            return res.json({ success: false, message: '房间人满，无法加入....' });
        }
        if (playerCount < 2 && hostUserId != userid) {
            // 修改房间人数
            await db.execute(
                `update rooms
             SET player_count = ?,
                 room_status = 'playing',
                 player_id = ?
             WHERE room_id = ?`,
                [playerCount + 1, userid, roomId]
            )
            // 数据库插入新的match记录
            const [result] = await db.execute(
                `INSERT INTO matches (room_id, player_1_id, player_2_id)
                 VALUES (?, ?, ?)`,
                [roomId, hostUserId, userid]
            );
            var room = roomList.get(Number(roomId));
            room.playerY = userid;
            room.matchId = result.insertId;  // 绑定matchId
            room.playerCount = room.playerCount + 1;

            // 对数据库的表users进行操作： 将2个玩家的games_played + 1
            await db.execute(
                `UPDATE users
                 SET games_played = games_played + 1
                 WHERE userid =? OR userid =?`,
                [hostUserId, userid]
            );
        } else {
            return res.json({ success: false, message: '房间已满，无法加入....' });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('玩家' + userid + + '，加入房间失败:', err.message);
        res.json({ success: false, message: '服务错误' });
    }
})

const userExit = async (userid, roomId) => {
    const [result] = await db.execute(
        `SELECT *
         FROM rooms
         WHERE room_id = ?`,
        [roomId]
    );
    const hostUserId = result[0].host_user_id;
    const playerId = result[0].player_id;
    const playerCount = result[0].player_count;
    const roomStatus = result[0].room_status;
    if (userid == hostUserId) {
        await db.execute(
            `update rooms
             SET room_status = 'finished'
             WHERE room_id = ?`,
            [roomId]
        )
        broadcastToRoom(roomId, { type: "ConnectionDenial", message: "房间已解散..." });
        roomList.delete(Number(roomId));
    } else if (userid == playerId) {
        var room = roomList.get(Number(roomId));
        if (room != undefined) {
            await db.execute(
                `update rooms
             SET player_count = ?,
                 room_status = 'playing',
                 player_id = ?
             WHERE room_id = ?`,
                [playerCount - 1, null, roomId]
            )
            room.playerCount = room.playerCount - 1;
            broadcastToRoom(roomId, { type: "UserExit", message: "有玩家退出游戏..." });
        }
    }
}

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
        ws.close();
        return;
    }

    let isAlive = true;

    ws.on('pong', () => {
        isAlive = true;
        console.log(`收到客户端的 pong 响应，房间号：${roomId}，用户号：${userid}`);
    });

    const interval = setInterval(() => {
        if (!isAlive) {
            console.log(`客户端超时，断开连接，房间号：${roomId}，用户号：${userid}`);
            userExit(userid, roomId);
            ws.terminate();
            interval.close();
        }
        isAlive = false;
        ws.ping();
    }, 10000);

    console.log(`客户端 ${userid}，已连接到房间: ${roomId}`);

    // 将当前房间的棋盘信息发送给客户端
    if (roomList.has(Number(roomId))) {
        ws.send(JSON.stringify({ type: 'INIT_BOARD', board: roomList.get(Number(roomId)).boards }));
        // 在数据库中查询玩家的信息
        const [userX] = await db.execute(
            `SELECT username, nickname, email, sex
             FROM users
             WHERE userid =?`,
            [hostUserId]
        );
        const [userY] = await db.execute(
            `SELECT username, nickname, email, sex
             FROM users
             WHERE userid =?`,
            [userid]
        );

        // 把玩家的资料信息发送给客户端
        broadcastToRoom(roomId, {
            type: 'Player_Info',
            roomId: roomId,
            playerX: hostUserId, playerY: userid,
            playerXName: userX[0].username,
            playerYName: userY[0].username,
            playerXNickname: userX[0].nickname,
            playerYNickname: userY[0].nickname,
            playerXEmail: userX[0].email,
            playerYEmail: userY[0].email,
            playerXSex: userX[0].sex,
            playerYSex: userY[0].sex
        })
    }

    // 监听来自客户端的棋盘更新消息
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'MOVE') {
            // 更新棋盘状态
            if (roomList.has(Number(roomId))) {
                if (roomList.get(Number(roomId)).playerY == '') {
                    // 如果不是当前无玩家加入，无法落子
                    ws.send(JSON.stringify({ type: 'GAME_TAG', message: '没有玩家加入房间，无法落子...' }));
                }
                else if (roomList.get(Number(roomId)).playing != data.player) {
                    // 如果不是当前玩家的回合，无法落子
                    ws.send(JSON.stringify({ type: 'GAME_TAG', message: '当前不是你的回合，无法落子...' }));
                } else {
                    roomList.get(Number(roomId)).boards[data.row][data.col] = data.player == hostUserId ? 'X' : 'O';
                    // 插入游戏记录到数据库
                    try {
                        // 在数据库中插入落子记录
                        db.execute(
                            `INSERT INTO game_moves (match_id, player_id, x, y)
                                             VALUES (?, ?, ?, ?)`,
                            [roomList.get(Number(roomId)).matchId, roomList.get(Number(roomId)).playing, data.row, data.col]
                        );

                    } catch (err) {
                        console.error("插入游戏记录失败", err);
                        return;
                    }

                    // 广播棋盘更新
                    broadcastToRoom(roomId, { type: 'UPDATE_BOARD', board: roomList.get(Number(roomId)).boards });
                    // 判断是否有胜利者
                    const winner = checkWinner(roomId, data.row, data.col, data.player == hostUserId ? 'X' : 'O');
                    if (winner) {
                        try {
                            db.execute(
                                `UPDATE matches
                                 SET winner_id = ?
                                 WHERE match_id = ?`,
                                [roomList.get(Number(roomId)).playing, roomList.get(Number(roomId)).matchId]  // winner 是胜利者的玩家 ID
                            );
                            // 在数据库中将胜利者的胜利场次games_won + 1:
                            db.execute(
                                `UPDATE users
                                 SET games_won = games_won + 1
                                 WHERE userid =?`,
                                [roomList.get(Number(roomId)).playing]  // winner 是胜利者的玩家 ID
                            );

                        } catch (err) {
                            console.error("更新胜利者失败", err);
                            return;
                        }
                        // 广播胜利信息
                        broadcastToRoom(roomId, { type: 'VICTORY', winner })
                        db.execute(
                            `UPDATE rooms
                             SET room_status = ?
                             WHERE room_id = ?`,
                            ['finished', roomId]  // winner 是胜利者的玩家 ID
                        );
                    }
                    // 没有任何人获胜，切换回合
                    roomList.get(Number(roomId)).playing = data.player == roomList.get(Number(roomId)).playerX ? roomList.get(Number(roomId)).playerY : roomList.get(Number(roomId)).playerX;

                }
            }
        }
        // 接收房间发来的CHAT_MESSAGE的消息并广播
        if (data.type === 'CHAT_MESSAGE') {
            broadcastToRoom(roomId, { type: 'CHAT_MESSAGE', message: data.message, userid: data.userid });

            // 插入聊天记录到数据库
            try {
                // 在控制台输出要插入的值
                console.log("插入的房间 ID:", roomId);
                console.log("插入的用户 ID:", data.sender);
                console.log("插入的消息内容:", data.message);


                // 在数据库中插入聊天记录
                db.execute(
                    `INSERT INTO chat_messages (room_id, user_id, content)
                     VALUES (?,?,?)`,
                    [roomId, data.sender, data.message]
                );
            } catch (err) {
                
                console.error("插入聊天记录失败", err);
            }
        }


        // 标记一下有bug暂时先不解决并且隐藏这个功能
        if (data.type === 'RESET_GAME') {
            // 重置棋盘
            if (roomList.has(Number(roomId))) {
                roomList.get(Number(roomId)).boards = Array(15).fill(null).map(() => Array(15).fill(null));
                broadcastToRoom(roomId, { type: 'RESTART', board: roomList.get(Number(roomId)).boards });
                // 数据库插入新的match记录
                try {
                    const [result] = await db.execute(
                        `INSERT INTO matches (room_id, player_1_id, player_2_id)
                         VALUES (?, ?, ?)`,
                        [roomId, hostUserId, userid]
                    );
                    console.log(result);  // 打印检查返回值的结构
                    roomList.get(Number(roomId)).matchId = result.insertId;  // 绑定 matchId
                } catch (error) {
                    console.error('数据库操作失败:', error);
                }
            }
        }
    });

    // WebSocket 关闭时，移除该连接
    ws.on('close', () => {
        console.log(`客户端: ${userid} 与房间: ${roomId} 断开连接`);
    });
});

// 房间更新广播
function broadcastToRoom(roomId, message) {
    wss.clients.forEach((client) => {
        if (client.roomId == roomId && client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// 胜利判断函数
function checkWinner(roomId, row, col, player) {
    if (!roomList.has(Number(roomId))) return null;
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
            if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && roomList.get(Number(roomId)).boards[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        // 检查后方
        for (let i = 1; i < 5; i++) {
            const newRow = row - dRow * i;
            const newCol = col - dCol * i;
            if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && roomList.get(Number(roomId)).boards[newRow][newCol] === player) {
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
