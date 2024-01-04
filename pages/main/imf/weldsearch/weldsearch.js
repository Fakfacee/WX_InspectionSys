// pages/main/imf/weldsearch/weldsearch.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  spool_num : null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var spool = options.spool;
    this.setData({
      spool_num : spool,
    });
  //searchspoolimfall
  wx.request({
    url: app.globalData.url+'searchspoolimfall',
    method : 'POST',
    //dataType : 'JSON',
    data:{value :'0',spool:this.data.spool_num},
    success:(res) =>{
      console.log(res)
      console.log(res.data)
      var result = res.data
      if (result.length ==0) {
//未查询到检验结果
      wx.showToast({   
          title: '无法查询到此单管，请检查后重试',   
          icon: 'none',   
          duration: 2000   
      }) 
//判断活动类型
    }else {
        console.log(result)
        this.setData({
          resultList : result,
        })

    }
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