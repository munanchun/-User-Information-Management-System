// pages/index/index.js

Page({
    data: {
        swiperList:[]
      },
      getSwiperList(){

        this.setData({
          swiperList : [{
            id:1,
            image:'/images/img2.png'
          },
          {
            id:2,
            image:'/images/img1.jpg'
          }]        
        })
      },
  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  onLoad(options) {
    this.getSwiperList();
  }
});
