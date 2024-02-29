// pages/index/fit_shaoma.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  active_type : [''],
  spool : [],
  spoolList : [],
  autoCompleteList :[],
  },
  copytext(e){
    console.log('长按选择目标单管')
    let key = e.currentTarget.dataset.key;
    console.log(key)
    this.setData({
      spool : key

    })
      wx.setClipboardData({
        data: key,
        success(res) {
          wx.showToast({
            title: '选择成功',
          })
        }
      })
    
    },
  scanCodeEvent: function(){
    //增加扫码清除文本框内容功能
    var that = this
    wx.scanCode({
      success(res){
        //10-CR-15001-B0CF3S-HT46-W-02
        var spool_num = res.result
        // 扫码成功后  在此处理接下来的逻辑
        that.setData({
          spool: spool_num
        })
      },
      })
 },

  get_text: function(e){
    const inputValue = e.detail.value; // 获取用户输入的值
    const autoCompleteList = this.getAutoCompleteList(inputValue); // 获取自动补齐的列表
    
    this.setData({
      spool: inputValue,
      autoCompleteList: autoCompleteList.slice(0,20),
    });
  },
  getAutoCompleteList(inputValue) {
  const regex = new RegExp(inputValue, 'i'); // 创建不区分大小写的正则表达式
  const filteredData = this.data.spoolList.filter(item => {
      return regex.test(item); // 使用正则表达式进行模糊匹配
  });
  return filteredData
  },

  submit(e) {
    //加全局变量，图纸，单管，焊口这些信息
    var that = this.data;
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
      }else if(that.active_type == 'fitInspect'){
        wx.navigateTo({

          url: '../fitInspectApply/fitInspectApply?spool='+that.spool,

      })
      }else if(that.active_type == 'weldInspect'){
        wx.navigateTo({

          url: '../weldInspectApply/weldInspectApply?spool='+that.spool,

      })
      }else if(that.active_type == 'weldsearch'){
        wx.navigateTo({

          url: '../../main/imf/weldsearch/weldsearch?spool='+that.spool,

      })

    }
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var result = wx.getStorageSync('spoolList')
    if(result){
      this.setData({
        spoolList : result
      })
    }else{
      this.setData({
        spoolList : ['单管清单获取失败，请重新登录']
      })
    }
      
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