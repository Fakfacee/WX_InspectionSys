// pages/main/user/user.js
var app = getApp()
Page({
data:{
  user_name : [],
  subcontractor : [],
  usr_class : [],
  class_id : [],
  WelderNo :[],
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData.subcontractor),
    this.setData({
      user_name : app.globalData.name,
      subcontractor : app.globalData.subcontractor,
      usr_class : app.globalData.class,
      WelderNo : app.globalData.WelderNo,
      class_id : app.globalData.class_id,
    })
 
  },
  logOut: function() {
    console.log('登出')
    wx.removeStorage({
      key: 'password',
      key: 'phone',
      success (res) {
        wx.redirectTo({
          url : '/pages/main/login/login',
      
          })
      }
    })
   
  
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})