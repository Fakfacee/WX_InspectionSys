// pages/main/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio_state_id : 'false',
    code:[],
    sub:[],
    welder:[],
    phoneno:[],
    password:[],
    subcontractorList:[],
    id: [
      {value: '3', id: '焊工'}
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //获取承包商清单
    wx.request({
      url: app.globalData.url + 'searchcontractor',
      success: (res) => {
        this.setData({
        subcontractorList : res.data
      })
      }
    })
 
  },
  get_text_welder: function(e){
    this.setData({
      welder:e.detail.value
    })  
  },


  get_text_sub: function(e){
    this.setData({
      sub:e.detail.value
    })  
  },
  get_text_phoneno: function(e){
    this.setData({
      phoneno:e.detail.value
    })  
  },
  radioChange_subcontractor(e){
    this.setData({
      radio_state_subcontractor : 'ture',
      subcontractor_submit:e.detail.value
    })
},
  get_text_password: function(e){
    this.setData({
      password:e.detail.value
    })  
  },

  radioChange_id:function(e){
    this.setData({
    radio_state_id : 'ture',
    code : e.detail.value
    })
  },

  submit(e) {
    if(this.data.radio_state_id ==='false'){
      this.setData({
      code : '1'
      })
    };
    //指代到下一级
    wx.request({
      url: app.globalData.url+'register', //仅为示例，并非真实的接口地址
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
      //code:2检验员，3焊工，1车间管理人员
      code:this.data.code,
      contractor:this.data.subcontractor_submit,
      phoneno:this.data.phoneno,
      welder:this.data.welder,
      password:this.data.password,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.statusCode !=200){
          wx.showToast({
            title: res.statusCode+"提交失败，请检查数据的完整性",   
            icon: 'none',   
            duration: 2000   
            }) 
        }else{
          var result = JSON.parse(res.data)
          if(result.Status ==3){
            wx.showToast({   
              title: '注册成功，请返回登录页面', 
              icon: 'none',  
              duration: 2000   
            })  
        }else{
          wx.showToast({   
              title: result.Note, 
              icon: 'none',  
              duration: 2000   
            })   
        }
        }
        },
      fail(res){
        wx.showToast({   
          title: '请求失败，请重试或与管理员取得联系',   
          icon: 'none',
          duration: 2000   
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