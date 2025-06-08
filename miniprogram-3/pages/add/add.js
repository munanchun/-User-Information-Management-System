Page({
  data: {
    name: '',
    age: '',
    gender: '男',
    phone: ''
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },
  onGenderChange(e) {
    this.setData({
      gender: e.detail.value
    });
  },
  submitForm() {
    const { name, age, gender, phone } = this.data;
    if (!name || !age || !phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    const apiUrl = getApp().globalData.apiUrl + '/users';
    wx.request({
      url: apiUrl,
      method: 'POST',
      data: {
        name,
        age: parseInt(age),
        gender,
        phone
      },
      success: (res) => {
        if (res.statusCode === 201) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  }
});