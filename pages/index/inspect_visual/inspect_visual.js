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
    drawing_num:'',
    spool_num:'',
    
    joint: [
      {value: '1', joint: '1',checked: 'true'},
      {value: '2', joint: '2'},
      {value: '3', joint: 'FW-3'}
    ],
  
    result: [
      {value: '1', name: 'ACC',checked: 'true'},
      {value: '2', name: 'REJ'},
    ],

    location: [
      {value: '1', name: '配套车间',checked: 'true'},
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
      wps_submit : this.data.result[0].name
      })
    }
    if(this.data.radio_state_location ==='false'){
      this.setData({
      location_submit : this.data.location[0].name
      })
    }
    wx.request({
      url: app.globalData.url+'waiguaninspectionrequest',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        WeldNo: this.data.joint_submit,
        DrawingNo: this.data.drawing_num,
        PipeNo:this.data.spool_num,
        WelderNo : this.data.WelderNo,
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
      });
  
      wx.request({
        url: app.globalData.url+'searchallweldbypipe',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          var result = JSON.parse(res.data)
          var data = result
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