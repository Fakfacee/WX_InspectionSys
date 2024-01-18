// pages/main/main_page.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  //QC-1,WELDER-2,AUTHOR-0
  class_code : null,
},

  jump2fitup(e){
    var active_type = 'fit_up'
    wx.navigateTo({
      url: '../index/shaoma/shaoma?active_type='+active_type,
    }) 
   },
   jump2weld(e){
    var active_type = 'weld'
    wx.navigateTo({
      url: '../index/shaoma/shaoma?active_type='+active_type,
    }) 
   },
   jump2fitInspect(e){
  
    wx.navigateTo({
      url : '../index/inspectFitList/inspectFitList'
    }) 
   },

   jump2weldInspect(e){
    
    wx.navigateTo({
      url : '../index/inspectWeldList/inspectWeldList'
    }) 
   },
   jump2inspect_visual(e){
    var active_type = 'inspect_visual'
    wx.navigateTo({
      url: '../index/shaoma/shaoma?active_type='+active_type,
    }) 
   },
   jump2inspect_fit(e){
    var active_type = 'inspect_fit'
    wx.navigateTo({
      url: '../index/shaoma/shaoma?active_type='+active_type,
    }) 
   },

  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },
  onLoad(){
  wx.showLoading({
    title: '数据缓存中...',
  });
  //登录时即获取单管LIST
  wx.request({
    url: app.globalData.url + 'searchallpipeno',
    method : 'POST',
    //data:that.spool_num,
    dataType : 'JSON',
    success:(res) =>{
    var result = JSON.parse(res.data)
    wx.setStorageSync('spoolList', result);
    }
  }); 
  this.setData({
    class_code : app.globalData.class_code
  });
  wx.hideLoading();
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
