// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 登录接口
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // 查询用户（修改表名）
        const [rows] = await db.execute('SELECT * FROM adm WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        const user = rows[0];

        // 验证密码（实际项目中应使用 bcrypt）
        const isPasswordValid = password === user.password;

        if (!isPasswordValid) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 生成 JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;