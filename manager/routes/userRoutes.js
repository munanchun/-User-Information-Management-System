const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateUser } = require('../utils/validate');

// 获取用户列表（支持分页和搜索）
router.get('/users', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize) || 10));
    const offset = (page - 1) * pageSize;
    const { keyword } = req.query;
    const conditions = [];

    const safeKeyword = keyword ? keyword.replace(/[^\w\u4e00-\u9fa5]/g, '') : '';
    if (safeKeyword) {
      conditions.push(`(name LIKE '%${safeKeyword}%' OR phone LIKE '%${safeKeyword}%')`);
    }

    let baseSql = 'SELECT * FROM users';
    let countSql = 'SELECT COUNT(*) AS total FROM users';
    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      baseSql += whereClause;
      countSql += whereClause;
    }

    const querySql = `${baseSql} LIMIT ${pageSize} OFFSET ${offset}`;
    const [countResult] = await db.execute(countSql);
    const total = countResult[0].total;
    const [rows] = await db.execute(querySql);

    res.json({ list: rows, total });
  } catch (err) {
    console.error('获取用户列表失败:', err);
    next(err);
  }
});

// 获取用户列表（兼容旧接口）
router.get('/users/list', async (req, res, next) => {
  try {
    const { keyword } = req.query;
    let sql = 'SELECT * FROM users';
    let values = [];

    if (keyword) {
      sql += ' WHERE name LIKE ? OR phone LIKE ?';
      values = [`%${keyword}%`, `%${keyword}%`];
    }

    const [rows] = await db.execute(sql, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 获取单个用户
router.get('/users/:id', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// 添加用户
router.post('/users', async (req, res, next) => {
  try {
    const errors = validateUser(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { name, age, gender, phone } = req.body;
    const [result] = await db.execute(
        'INSERT INTO users (name, age, gender, phone) VALUES (?, ?, ?, ?)',
        [name, age, gender, phone]
    );

    res.status(201).json({
      id: result.insertId,
      message: '用户添加成功',
      affectedRows: result.affectedRows
    });
  } catch (err) {
    next(err);
  }
});

// 更新用户（关键修改点：返回更新结果）
router.put('/users/:id', async (req, res, next) => {
  try {
    // 检查用户是否存在
    const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 表单验证
    const errors = validateUser(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { name, age, gender, phone } = req.body;
    const [result] = await db.execute(
        'UPDATE users SET name = ?, age = ?, gender = ?, phone = ? WHERE id = ?',
        [name, age, gender, phone, req.params.id]
    );

    return res.json({
      message: '用户更新成功',
      affectedRows: result.affectedRows, // 返回受影响的行数
      updatedId: req.params.id
    });
  } catch (err) {
    console.error('更新用户失败:', err);
    next(err);
  }
});

// 删除用户
router.delete('/users/:id', async (req, res, next) => {
  try {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '用户删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;