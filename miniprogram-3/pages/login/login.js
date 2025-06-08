// pages/login/login.js
Page({
  data: {
    username: '',
    password: '',
    canLogin: false,
    errorMessage: ''
  },
  
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    }, this.validateForm);
  },
  
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    }, this.validateForm);
  },
  
  validateForm() {
    const { username, password } = this.data;
    this.setData({
      canLogin: username.trim() && password.trim()
    });
  },
  
  handleLogin() {
    const { username, password } = this.data;
    
    // 显示加载中
    wx.showLoading({
      title: '登录中...',
      mask: true
    });
    
    // 调用登录接口
    wx.request({
      url: `${getApp().globalData.apiUrl}/auth/login`,
      method: 'POST',
      data: {
        username,
        password
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 登录成功，保存 token 到本地存储
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('userInfo', res.data.user);
          
          // 显示成功提示
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          
          // 延迟后跳转到用户管理页面
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/userList/userList' // 假设用户列表页的路径
            });
          }, 1500);
        } else {
          // 登录失败
          this.setData({
            errorMessage: res.data.message || '登录失败，请重试'
          });
        }
      },
      fail: (err) => {
        console.error('登录请求失败:', err);
        this.setData({
          errorMessage: '网络错误，请检查网络连接'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
});