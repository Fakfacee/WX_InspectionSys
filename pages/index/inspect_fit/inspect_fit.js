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
    UserId:null,
    WelderNo :[],
    drawing_num:'',
    drawing_nums:[],
    spool_num:'',
    weldid:[],
    joint: [],
  
    result: [
      {value: '1', name: 'ACC'},
      {value: '0', name: 'REJ'},
    ],

    location: [],

  },

  submit(e) {
    wx.request({
      url: app.globalData.url+'zuduiinspectionrequest',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        WeldId : this.data.weldid,
        WeldNo: this.data.joint_submit,
        DrawingNo: this.data.drawing_nums,
        PipeNo:this.data.spool_num,
        UserId : this.data.UserId,
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

    checkboxChange_joint:function(e){
    var jointok = this.data.joint
    var values = e.detail.value
    var joint_submits = [];
    var drawing_nums = [];
    var weldids = [];
    for (var i = 0; i < values.length; i++) {
        const value = values[i]
        joint_submits.push(jointok[value].joint)
        drawing_nums.push(jointok[value].drawingnum)
        weldids.push(jointok[value].weldid)
    }
    this.setData({
    radio_state_joint : 'ture',
    joint_submit : joint_submits,
    drawing_nums :  drawing_nums,
    weldid : weldids,
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
        UserId : app.globalData.class_id,
        WelderNo :app.globalData.WelderNo,
        //UserId : app.globalData.UserId,与焊工界面信息统一使用变量WelderNo
      });
  
      wx.request({
        url: app.globalData.url+'searchzuduiinsbypipeforinspect',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          var result = JSON.parse(res.data)
          var status = result[0].status
          //增加无返回结果判断
          if(status[0].Status == 0){
            this.setData({
              joint : [],
              drawing_num : '此单管下未查询到满足检验条件焊口',
              spool_num : spool,
              });

          }else if(status[0].Status == 1){
            var weld = result[1].weld
            var drawing = weld[0].DrawingNo
            var lists = []
            //for 循环
            for(let i = 0;i<Object.keys(weld).length;i++)
            {
              var object = new Object()
              //引入图纸号
              object.drawingnum = weld[i].DrawingNo
              object.weldid = weld[i].WeldId
              object.value = i
              object.joint = weld[i].WeldNo
              lists.push(object)
            }
            this.setData({
            joint : lists,
            drawing_num : drawing,
            spool_num : spool,
            }); 
          }else if(status[0].Status == 2){
            wx.showToast({
              title: status[0].Note,
              icon: 'none',   
              duration: 2000 
            })
            }
        }//success
        
      })//request
    },
    //地图函数，待完善
    onReady: function (e) {
      this.mapCtx = wx.createMapContext('myMap')
    }
  })