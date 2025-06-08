// app.js
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth'); // 认证路由（包含注册和登录）
const errorHandler = require('./middleware/errorHandler');
const morgan = require('morgan'); // HTTP请求日志中间件

// 环境变量配置
require('dotenv').config(); // 加载.env文件中的环境变量

// 中间件
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // 开发环境使用的请求日志中间件

// 路由
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes); // 认证相关接口

// 404处理
app.use((req, res, next) => {
  const error = new Error('未找到该路由');
  error.status = 404;
  next(error);
});

// 错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});