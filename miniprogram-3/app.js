App({
  onLaunch() {
    // 可在此进行全局初始化操作，如设置全局数据等
    this.globalData.apiUrl = 'http://localhost:3000/api'; // 后端接口基础地址
  },
  globalData: {
    apiUrl: ''
  }
});