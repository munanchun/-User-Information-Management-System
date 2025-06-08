const validateUser = (user) => {
    const errors = [];

    if (!user.name || user.name.length > 50) {
        errors.push('姓名不能为空且长度不能超过50');
    }

    if (!user.age || isNaN(Number(user.age)) || user.age <= 0) {
        errors.push('年龄必须为正整数');
    }

    const validGenders = ['男', '女', '其他'];
    if (!validGenders.includes(user.gender)) {
        errors.push('性别值无效');
    }

    if (!user.phone || !/^1[3-9]\d{9}$/.test(user.phone)) {
        errors.push('手机号格式不正确');
    }

    return errors;
};

module.exports = { validateUser };