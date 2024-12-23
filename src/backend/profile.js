// profile.js
import express from 'express';
import db from './db.js';

const router = express.Router();

// 用户资料读取接口
router.post('/', async (req, res) => {
    const { userid } = req.body;

    if (!userid) {
        return res.status(400).json({ success: false, message: '用户ID未提供' });
    }

    try {
        console.log("收到的用户ID:", userid);

        const [rows] = await db.execute(
            'SELECT userid, username, email, nickname, sex, games_played, games_won, coins, created_at, last_login, permission_level FROM users WHERE userid = ?',
            [userid]
        );

        if (rows.length === 0) {
            console.log("用户不存在");
            return res.status(404).json({ success: false, message: '用户不存在' });
        }

        const user = rows[0];
        console.log("用户数据:", user);

        res.json({ success: true, message: '资料读取成功', data: user });
    } catch (error) {
        console.error('数据库错误:', error);
        res.status(500).json({ success: false, message: '数据库错误' });
    }
});
