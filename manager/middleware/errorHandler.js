// 统一错误处理
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: '数据已存在' });
    }

    res.status(500).json({
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
};

module.exports = errorHandler;