Page({
  data: {
    userList: [], 
    searchValue: '', 
  },

  onLoad() {
    this.fetchUserList();
  },

  // 获取用户列表（支持搜索）
  fetchUserList() {
    wx.showLoading({ title: '加载中...' });
    const { searchValue } = this.data;
    wx.request({
      url: `${getApp().globalData.apiUrl}/users/list`, 
      method: 'GET',
      data: { keyword: searchValue.trim() },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) { 
          this.setData({
            userList: res.data,
          });
        } else {
          wx.showToast({ title: '获取数据失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        console.error('请求失败:', err);
      },
    });
  },

  // 搜索输入事件
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  // 处理搜索
  handleSearch() {
    this.fetchUserList();
  },

  // 重置搜索
  resetSearch() {
    this.setData({
      searchValue: ''
    });
    this.fetchUserList(); 
  },

  // 跳转到编辑页面
  navigateToEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/edit/edit?id=${id}`
    });
  },

  // 删除用户
  deleteUser(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该用户吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${getApp().globalData.apiUrl}/users/${id}`,
            method: 'DELETE',
            success: (res) => {
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                this.fetchUserList(); 
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            }
          });
        }
      }
    });
  },

  // 添加：跳转到添加用户页面
  navigateToAdd() {
    wx.navigateTo({
      url: '/pages/add/add'
    });
  },

  // 跳转到专门的分页显示页面（若需要，可保持此跳转）
  gotoPaginationPage() {
    wx.navigateTo({
      url: '/pages/pagination/pagination',
    });
  }
});