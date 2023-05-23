// pages/main/imf/imfFit/imfFit.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationList:[],
    result: [{LocationName:'结构车间',DrawingNo:'xxx01',WeldNo:'1'},{LocationName:'结构车间',DrawingNo:'xxx01',WeldNo:'1'},{LocationName:'结构车间',DrawingNo:'xxx01',WeldNo:'2'},{LocationName:'配套车间',DrawingNo:'xxx02',WeldNo:'2'}],
    
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.request({
      
      url: app.globalData.url+'searchzuduiinsforinspect',
          method : 'POST',
          dataType : 'JSON',
         
          success:(res) =>{
          //[{"ZuDuiId": 12, "WeldId": 1778, "WelderId": 10, "…-A0CA3Z_SHT1", "PipeNo": "2-DO-35622-A0CA3Z-01"}]
          //var result = JSON.parse(res.data)
          console.log('------******-------')
          console.log(res)
          
          },
          fail:function(res){
      
            wx.showToast({
      
              title: "访问失败，当前网络连接不可用",   
              icon: 'none',   
              duration: 2000   
              }) 
      
            }

    })

    var i ;
    var j ;
    var status = 0;
    var result = this.data.result;
    var locationList = this.data.locationList;
    
    for(i=0;i<result.length;i++){
      
      for(j= 0;j<locationList.length;j++){

       if(result[i].LocationName == locationList[j].location){
        
         locationList[j].inf.push(result[i])
         status = 1
         break
         //locationList[j].inf.push(result[i])
         //break
       }
     }
     if(status ==1){
     status = 0
     continue
     }else{
      locationList.push({location:result[i].LocationName,inf:[result[i]]})
      status = 0
     }
     
   }
   
   console.log(locationList)
  this.setData({
  
    locationList : locationList

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