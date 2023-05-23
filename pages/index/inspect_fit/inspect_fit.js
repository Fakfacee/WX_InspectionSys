var util = require('../../../util/util.js')
var app = getApp()
Page({
  data:{
    latitude: '',
    longitude: '',
    currenTime:[],
    location_submit : [],
    joint_submit :[],
    radio_state_joint: 'false',
    radio_state_result: 'false',
    radio_state_location: 'false',
    result_submit :[],
    WelderNo:[],
    //UserId : [],统一并为WelderNo
    drawing_num:'',
    spool_num:'',
    
    joint: [
    
    ],
  
    result: [
      {value: '1', name: 'ACC'},
      {value: '0', name: 'REJ'},
    ],

    location: [
      {value: '1', name: '配套车间'},
      {value: '2', name: '三号堆场'},
      {value: '3', name: '总装场地'}
    ],

  },

  submit(e) {
    //radiochange函数默认未选取时，状态取第一位
    if(this.data.radio_state_joint ==='false'){
    this.setData({
    joint_submit : this.data.joint[0].joint
    })
  }
    if(this.data.radio_state_result ==='false'){
      this.setData({
      wps_submit : this.data.result[0].value
      })
    }
    if(this.data.radio_state_location ==='false'){
      this.setData({
      location_submit : this.data.location[0].name
      })
    }
    wx.request({
      url: app.globalData.url+'zuduiinspectionrequest',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        WeldNo: this.data.joint_submit,
        DrawingNo: this.data.drawing_num,
        PipeNo:this.data.spool_num,
        UserId : this.data.WelderNo,
        Result : this.data.result_submit,
        WeldDate : this.data.currenTime,
        Longitude: this.data.longitude,
        Latitude : this.data.latitude,
        Location : this.data.location_submit
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        var result = JSON.parse(res.data)

        //{"Status":0,"Note":"此焊口有未申请"}
        console.log('-------组对信息提交返回code------------')
        console.log(res.statusCode)
        if(res.statusCode==200){
          console.log('-------组对信息提交返回Status------------')
          console.log(result.Status)
          if(result.Status == 0){
            console.log('提交失败，提示后端返回错误信息')
            wx.showToast({
              title: result.Note,   
              icon: 'none',   
              duration: 2000   
              })
          }else if(result.Status == 1){
            wx.navigateTo({
              url: '../../main/success/up_success',
            })
          }else{
            wx.showToast({
              title: "数据提交失败，请与管理员取得联系",   
              icon: 'none',   
              duration: 2000   
              })
            
          }
        }else{
          wx.showToast({
            title: res.code+"访问失败请与管理取得联系",   
            icon: 'none',   
            duration: 2000   
            }) 
          
        }
        
      },
      fail:function(res){
        wx.showToast({
          title: "访问失败，当前网络连接不可用",   
          icon: 'none',   
          duration: 2000   
          }) 
  
        }
    })
  },

  //获取焊工信息
   get_text: function(e){
      this.setData({
        welder:e.detail.value
      })
       
    },
    
  //获取location信息
    getCenterLocation: function (){
      var that = this
      wx.chooseLocation({
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          });
         },
         fail: function () {
         },
         complete: function () {
         }
     })
    
    },

   radioChange_joint:function(e){
    
    this.setData({
    radio_state_joint : 'ture',
    joint_submit : e.detail.value
    
    })
  },
    radioChange_result(e){
      console.log(e.detail.value)
      this.setData({
        radio_state_result : 'ture',
        result_submit:e.detail.value
      })
  },
  radioChange_location(e){
    this.setData({
      radio_state_location : 'ture',
      location_submit:e.detail.value
    })
},
    
    onLoad: function (options) {
      var that = this.data;
      var spool = options.spool;
      //var array = JSON.parse(options.spool);
      // 调用函数时，传入new Date()参数，返回值是日期和时间
      var currenTime= util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据
      this.setData({
        currenTime: currenTime,
        spool_num : spool,
        WelderNo : app.globalData.WelderNo,
      
        //UserId : app.globalData.UserId,与焊工界面信息统一使用变量WelderNo
      });
  
      wx.request({
        url: app.globalData.url+'searchzuduiinsbypipeforinspect',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          console.log('------searchzuduiinsbypipeforinspec查询结果------')
          var result = JSON.parse(res.data)
          console.log(result)
          //增加无返回结果判断
          if(result[0] == null){
            this.setData({
              joint : [],
              drawing_num : '此单管下未查询到满足检验条件焊口',
              spool_num : spool,
              });

          }else{
            
            //var jointLists = []
            //var drawingList = []
            var drawing = result[0].DrawingNo
            var lists = []
            //for 循环
  
            for(let i = 0;i<Object.keys(result).length;i++)
            {
              var object = new Object()
              object.value = i
              object.joint = result[i].WeldNo
              //取消默认首项勾选
              //if(i ==0){
                //object.checked = 'true'
                //}
  
                lists.push(object)
  
            }
            this.setData({
            joint : lists,
            drawing_num : drawing,
            spool_num : spool,
            }); 
          
          }//if
        }//success
        
      })//request
    },
    //地图函数，待完善
    onReady: function (e) {
      this.mapCtx = wx.createMapContext('myMap')
    }
  })