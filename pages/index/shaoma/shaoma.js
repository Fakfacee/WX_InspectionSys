// pages/index/fit_shaoma.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  active_type : ['fit_up'],
  spool : [],
  },
  scanCodeEvent: function(){
    var that = this
    wx.scanCode({
      success(res){
        console.log(res.result)
        //10-CR-15001-B0CF3S-HT46-W-02
        var spool_num = res.result
        // 扫码成功后  在此处理接下来的逻辑
        that.setData({
          spool: spool_num
        })
      },
      })
 },

  to_hand_write(){
   
  wx.navigateTo({
    url: '/pages/index/hand_write',
  })

  },

  get_text: function(e){
    this.setData({
      spool:e.detail.value
    })
  },
  submit(e) {
    var that = this.data;
    wx.request({
      url: app.globalData.url + 'searchaspool',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data:{value :'0',spool:that.spool},
      success:(res) =>{
        var result = JSON.parse(res.data)
        console.log(result.Status)
        console.log(result)
      if (result.Status =='0') {

//未查询到检验结果
      wx.showToast({   
          title: '无法查询到此单管，请检查后重试',   
          icon: 'none',   
          duration: 2000   
      }) 
//判断活动类型
    }else if (result.Status =='1'){
    //加全局变量，图纸，单管，焊口这些信息
    
    if(that.active_type == 'fit_up'){
        wx.navigateTo({
          url: '../fit_up/fit_up?spool='+that.spool,
      
          });
      }else if(that.active_type == 'weld'){
        wx.navigateTo({

          url: '../weld/weld?spool='+that.spool,
      
          });
      }else if(that.active_type == 'inspect_fit'){
        wx.navigateTo({

          url: '../inspect_fit/inspect_fit?spool='+that.spool,
      
          });
      }else if(that.active_type == 'inspect_visual'){
        wx.navigateTo({

          url: '../inspect_visual/inspect_visual?spool='+that.spool,
      
          }); 
      }
    }
      
      },

  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var active_type = options.active_type;
    this.setData({
      active_type : active_type,
    });
   
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