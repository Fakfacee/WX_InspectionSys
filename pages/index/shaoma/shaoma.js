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
    console.log('触发长按')
    let key = e.currentTarget.dataset.key;
    console.log(key)
      wx.setClipboardData({
        data: key,
        success(res) {
          wx.showToast({
            title: '复制成功',
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

  to_hand_write(){
   
  wx.navigateTo({
    url: '/pages/index/hand_write',
  })

  },

  get_text: function(e){
    const inputValue = e.detail.value; // 获取用户输入的值
    const autoCompleteList = this.getAutoCompleteList(inputValue); // 获取自动补齐的列表
    this.setData({
      spool: inputValue,
      autoCompleteList: autoCompleteList,
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
    var that = this.data;
    wx.request({
      url: app.globalData.url + 'searchaspool',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data:{value :'0',spool:that.spool},
      success:(res) =>{
      var result = JSON.parse(res.data)
    
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

    }
      
      },
    fail(){
      wx.showToast({   
        title: '系统繁忙，请稍后重试',   
        icon: 'none',   
        duration: 2000   
    }) 


    }
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: app.globalData.url + 'searchallpipeno',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      success:(res) =>{
      var result = JSON.parse(res.data)
      this.setData({
        spoolList : result,
      });
      }
    });
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