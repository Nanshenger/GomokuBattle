// login.js
import express from 'express';
import db from './db.js';

const router = express.Router();

// 用户登录接口
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: '用户名不存在' });
        }

        const user = rows[0];

        // 直接比较密码（明文）
        if (user.password === password) {
            const { userid, username, email, nickname, sex, game_played, games_won, coins, created_at, last_login, permission_level } = user;
            res.json({ success: true, message: '登录成功', data: { userid, username, email, nickname, sex, game_played, games_won, coins, created_at, last_login, permission_level } });
            // 对数据库中的users表中该用户的last_login字段进行更新
            await db.execute('UPDATE users SET last_login = NOW() WHERE userid = ?', [userid]);
        } else {
            res.json({ success: false, message: '密码错误' });
        }
    } catch (error) {
        console.error('数据库错误:', error);
        res.status(500).json({ message: '数据库错误' });
    }
});

export default router;
