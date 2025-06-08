Page({
  data: {
    userList: [], 
    currentPage: 1, 
    pageSize: 10, 
    totalCount: 0, 
    totalPages: 0, 
  },

  onLoad() {
    this.fetchUserList();
  },

  fetchUserList() {
    wx.showLoading({ title: '加载中...' });
    const { currentPage, pageSize } = this.data;
    wx.request({
      url: `${getApp().globalData.apiUrl}/users`,
      data: { page: currentPage, pageSize },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) { 
          const { list, total } = res.data;
          this.setData({
            userList: list,
            totalCount: total,
            totalPages: Math.ceil(total / pageSize),
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

  prevPage() {
    if (this.data.currentPage > 1) {
      this.setData({ currentPage: this.data.currentPage - 1 }, () => {
        this.fetchUserList();
      });
    }
  },

  nextPage() {
    if (this.data.currentPage < this.data.totalPages) {
      this.setData({ currentPage: this.data.currentPage + 1 }, () => {
        this.fetchUserList();
      });
    }
  },

  onPageInput(e) {
    const inputPage = parseInt(e.detail.value, 10);
    if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= this.data.totalPages) {
      this.setData({ currentPage: inputPage }, () => {
        this.fetchUserList();
      });
    } else {
      wx.showToast({ title: '请输入有效页码', icon: 'none' });
    }
  },
});