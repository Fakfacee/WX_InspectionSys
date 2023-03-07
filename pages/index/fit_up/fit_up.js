var util = require('../../../util/util.js')
var app = getApp()
Page({
  data:{
    latitude: 23.099994,
    longitude: 113.324520,
    currenTime:[],

    joint_submit :[],
    radio_state_joint: 'false',
    radio_state_wps: 'false',
    wps_submit :[],
    WelderNo:[],
    drawing_num:['10-CR-15001-B0CF3S-HT46-W_SHT2'],
    spool_num:['10-CR-15001-B0CF3S-HT46-W-02'],
    
    joint: [
      {value: '1', joint: '1'},
      {value: '2', joint: '2', checked: 'false'},
      {value: '3', joint: 'FW-3'}
    ],
  
    wps: [
      {value: '1', name: 'CS-101',checked: 'true'},
      {value: '2', name: 'CS-301'},
      {value: '3', name: 'CS-102'}
    ]

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
        Latitude : this.data.latitude
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.navigateTo({
        url: '../../main/success/up_success',
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
    getCenterLocation: function () {

      let that = this;
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] == false){// 如果已拒绝授权，则打开设置页面
            wx.openSetting({
              success(res) {}
            })
          }  else { // 第一次授权，或者已授权，直接调用相关api
            that.getMyLocation()
          }
        }
      })
        },
        getMyLocation(){
          wx.chooseAddress({
            type: 'wgs84',
            success:(res) =>{
              console.log(res),
              console.log(res.latitude),
              this.setData({
                latitude: res.latitude,
                longitude: res.longitude
                })
            },
            fail:(res)=>{
            console.log(res)
            console.log("获取失败")
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
  
      wx.request({
        url: app.globalData.url+'searchallweldbypipe',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          var result = JSON.parse(res.data)
          
          var data = result.Data
          var drawing = data[0].DrawingNo
          var lists = []
          //for 循环

          for(let i = 0;i<Object.keys(data).length;i++)
          {
            var object = new Object()
            object.value = i
            object.joint = data[i].WeldNo
            if(i ==0){
              object.checked = 'true'
              }
              lists.push(object)

          }
  
          this.setData({
          joint : lists,
          drawing_num : drawing,
          spool_num : spool,
          }); 
        }, 
        });
    },
    //地图函数，待完善
    onReady: function (e) {
      this.mapCtx = wx.createMapContext('myMap')
    }
  })