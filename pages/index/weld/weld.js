var util = require('../../../util/util.js')
var app = getApp()
Page({
  data:{
    latitude:'' ,
    longitude: '',
    currenTime:[],
    location_submit : [],
    joint_submit :[],
    radio_state_joint: 'false',
    radio_state_wps: 'false',
    radio_state_location: 'false',
    wps_submit :[],
    WelderNo:[],
    drawing_num:'',
    spool_num:'',
    
    jointOk: [
    ],
    jointNotOk : [
      
    ],

    wps: [
      {WPSId: '1', WPS: 'CS-101'},
      {WPSId: '2', WPS: 'CS-301'},
      {WPSId: '3', WPS: 'CS-102'}
    ],
    location: [
      {LocationListId: '1', LocationName: '配套车间'},
      {LocationListId: '2', LocationName: '三号堆场'},
      {LocationListId: '3', LocationName: '总装场地'}
    ],

  },

  submit(e) {
    //指代到下一级
    if(this.data.radio_state_joint ==='false'){
    this.setData({
    joint_submit : this.data.joint[0].joint
    })
  }
    if(this.data.radio_state_wps ==='false'){
      this.setData({
      wps_submit : this.data.wps[0].name
      })
    }

    if(this.data.radio_state_location ==='false'){
      this.setData({
      location_submit : this.data.location[0].name
      })
    }
    
    wx.request({
      url: app.globalData.url+'addweldinginfo',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        WeldNo: this.data.joint_submit,
        DrawingNo: this.data.drawing_num,
        PipeNo:this.data.spool_num,
        WelderNo : this.data.WelderNo,
        Wps : this.data.wps_submit,
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
        console.log('-------焊接信息提交返回code------------')
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
    radioChange_wps(e){
      this.setData({
        radio_state_wps : 'ture',
        wps_submit:e.detail.value
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
      });
      console.log('------请求满足焊接检验条件焊口-----')
      wx.request({
        url: app.globalData.url+'searchallweldbypipeforwelding',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          var result = JSON.parse(res.data)
          var data = result

          console.log('----查询结果为-----')
          console.log(data)
          var drawing = data[0].DrawingNo
          var listsCanNotWeld = []
          var listsCanWeld = []
          //for 循环

          for(let i = 0;i<Object.keys(data).length;i++)
          {
            var object = new Object()
            object.value = i
            object.joint = data[i].WeldNo
            if(data[i].IfWelding == 0){
              listsCanNotWeld.push(object)

            }else{
              listsCanWeld.push(object)
            }
            
          }
          this.setData({
          jointOk : listsCanWeld,
          jointNotOk : listsCanNotWeld,
          drawing_num : drawing,
          spool_num : spool,
          }); 
        }, 
        });


        wx.request({
          url: app.globalData.url+'searchWpsAndLocation',
          method : 'POST',
          dataType : 'JSON',
          success:(res) =>{
            var result = JSON.parse(res.data)
            var data = result
            console.log('-------工艺地点请求结果--------')
            console.log(data)
            var wpsList = data[0].wps
            var locationList = data[1].location

            this.setData({
              wps : wpsList,
              location : locationList,
              
              }); 
          }

        })
    },
    //地图函数，待完善
    onReady: function (e) {
      this.mapCtx = wx.createMapContext('myMap')
    }
  })