// pages/main/imf/imfWeld/imfWeld.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],
    //locationList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    });
    wx.request({
      url: app.globalData.url+'searchallweldforwelding_only1',
          method : 'POST',
          dataType : 'JSON',
          success:(res) =>{
          //[{"ZuDuiId": 12, "WeldId": 1778, "WelderId": 10, "…-A0CA3Z_SHT1", "PipeNo": "2-DO-35622-A0CA3Z-01","IfWelding": 0}]
          //var result = JSON.parse(res.data)
          console.log('------******-------')
          var result = JSON.parse(res.data)
          var i ;
          var resultList = [];
          //方案2--查询结果为返回所有值
          //object类枚举
          /** 
          for(var i in result){
            console.log(i) //获取键
            console.log(result[i])
          }
          
          for(i in result){
                for(j= 0;j<locationList.length;j++){
                if(result[i].IfWelding == 1){
                if(result[i].LocationName == locationList[j].location){
                  locationList[j].inf.push(result[i])
                  status = 1
                  break
                  //locationList[j].inf.push(result[i])
                  //break
             }
            }else{
              break
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
        */
        //方案1
        for(i in result){
          resultList.push(result[i])  //转LIST格式  
        }
        console.log(resultList)
        this.setData({
          result : resultList,  
        })
      
          },
          fail:function(res){
      
            wx.showToast({
      
              title: "访问失败，当前网络连接不可用",   
              icon: 'none',   
              duration: 2000   
              }) 
      
            },
            complete: function(res) {
              wx.hideLoading();
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