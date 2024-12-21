// register.js
import express from 'express';
import db from './db.js';

const router = express.Router();

// 用户注册接口
router.post('/', async (req, res) => {
    const { username, password, email, nickname, sex } = req.body;

    // 检查必填字段
    if (!username || !password || !email) {
        return res.status(400).json({ message: '用户名、密码和邮箱不能为空' });
    }

    // 检查用户名是否已存在
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 插入新用户到数据库
        const [insertResult] = await db.execute(
            'INSERT INTO users (username, password, email, nickname, sex, permission_level) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, email, nickname, sex || 'unknown', 1]  // 默认性别为unknown，权限为1
        );

        // 返回成功响应
        res.status(201).json({ message: '注册成功' });
    } catch (err) {
        console.error('注册过程中发生错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

export default router;
