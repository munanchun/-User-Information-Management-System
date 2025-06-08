Page({
  data: {
    userInfo: {
      id: '',        // 新增：存储用户ID
      name: '',
      age: '',
      gender: '',
      phone: ''
    },
    genderOptions: ['男', '女', '其他'],
    genderIndex: 0,
    loading: false,
    errorMsg: ''
  },

  onLoad: function (options) {
    const { id } = options;
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }
    
    this.setData({ loading: true });
    wx.request({
      url: `${getApp().globalData.apiUrl}/users/${id}`, 
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const userData = res.data;
          this.setData({
            userInfo: {
              id: userData.id,         // 关键：保存用户ID
              name: userData.name,
              age: userData.age.toString(), 
              gender: userData.gender,
              phone: userData.phone
            },
            genderIndex: this.getGenderIndex(userData.gender),
            loading: false
          });
        } else {
          this.setData({ 
            errorMsg: res.data?.message || '获取用户失败',
            loading: false 
          });
        }
      },
      fail: (err) => {
        this.setData({ 
          errorMsg: '网络错误：' + err.errMsg,
          loading: false 
        });
        console.error('获取用户信息失败:', err);
      }
    });
  },

  getGenderIndex: function (gender) {
    return this.data.genderOptions.indexOf(gender);
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`userInfo.${field}`]: value
    });
  },

  onGenderChange: function (e) {
    const index = e.detail.value;
    const gender = this.data.genderOptions[index];
    this.setData({
      genderIndex: index,
      'userInfo.gender': gender
    });
  },

  submitForm: function () {
    const { id, name, age, gender, phone } = this.data.userInfo;
    
    // 严格表单验证
    if (!name.trim()) {
      wx.showToast({ title: '姓名不能为空', icon: 'none' });
      return;
    }
    
    if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 150) {
      wx.showToast({ title: '请输入1-150之间的年龄', icon: 'none' });
      return;
    }
    
    if (!gender) {
      wx.showToast({ title: '请选择性别', icon: 'none' });
      return;
    }
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入有效的手机号', icon: 'none' });
      return;
    }
    
    // 确认用户ID存在
    if (!id) {
      wx.showToast({ title: '用户ID无效', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...', mask: true });
    
    wx.request({
      url: `${getApp().globalData.apiUrl}/users/${id}`, 
      method: 'PUT',
      data: { 
        name, 
        age: Number(age), 
        gender, 
        phone 
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data.affectedRows > 0) {
          wx.showToast({ 
            title: '保存成功', 
            icon: 'success' 
          });
          
          // 通知列表页刷新数据
          const pages = getCurrentPages();
          if (pages.length > 1) {
            const listPage = pages[pages.length - 2];
            if (listPage.reloadUserList) {
              listPage.reloadUserList();
            }
          }
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ 
            title: res.data?.message || '保存失败', 
            icon: 'none' 
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ 
          title: '网络错误：' + err.errMsg, 
          icon: 'none' 
        });
        console.error('提交失败:', err);
      }
    });
  }
});