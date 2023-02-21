// pages/index/inspect_fit.js
var app = getApp()
var util = require('../../../util/util.js')
Page({
  data:{
    latitude: 23.099994,
    longitude: 113.324520,
    currenTime:[],
    joint : [],
    joint_submit :[],
    radio_state_joint: 'false',
    radio_state_result: 'false',
    result_submit :[],
    people_qc:[],
    drawing_num:['10-CR-15001-B0CF3S-HT46-W_SHT2'],
    spool_num:['10-CR-15001-B0CF3S-HT46-W-02'],
    result: [
      {value: '1', name: 'ACC',checked: 'true'},
      {value: '2', name: 'REJ'},
    ]
  },

  submit(e) {
    //指代到下一级
    if(this.data.radio_state_joint ==='false'){
    this.setData({
    joint_submit : this.data.joint[0].joint
    })
  }
    if(this.data.radio_state_result ==='false'){
      this.setData({
      result_submit : this.data.result[0].name
      })
    }
    wx.request({
      url: app.globalData.url+'insert_inspect_fit', //仅为示例，并非真实的接口地址
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        joint: this.data.joint_submit,
        drawing: this.data.drawing_num,
        welder : this.data.people_qc,
        wps : this.data.result_submit,
        weld_date : this.data.currenTime,
        longitude: this.data.longitude,
        latitude : this.data.latitude
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        //console.log(res.data)
          wx.navigateTo({
            url: '../../main/success/up_success',
            })
      }
    })
  },


   get_text: function(e){
      this.setData({
        people_qc:e.detail.value
      })
    },
  //获取location信息
    getCenterLocation: function () {
        wx.getLocation({
          type :'wsg84',
          success:(res)=>{
          console.log('11')
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          });
        }
        });
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
        //获取QC信息
        welder : app.globalData.class_id,
      });
  
      wx.request({

        url: app.globalData.url+'query_joint',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          var result = JSON.parse(res.data)
          var data = result.data
          var drawing = data[0].DrawngNo
          var lists = []
  
          for(let i = 0;i<Object.keys(joint).length;i++)
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
          }); 
        }, 
        });

    },
    //地图函数，待完善
    onReady: function (e) {
      this.mapCtx = wx.createMapContext('myMap')
    }
  })