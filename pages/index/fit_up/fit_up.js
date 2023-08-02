var util = require('../../../util/util.js')
var app = getApp()
Page({
  data:{
    latitude: '',
    longitude: '',
    currenTime:[],
    location_submit : [],
    joint_submit :[],
    jointLocation:[],
    wps_submit :[],
    UserId:[],
    Contractor:[],
    drawing_num:'',
    spool_num:'',
    joint: [
    ],
    weldid:[],
    wps: [],
    location: [],
    prefabAssembly:[],
  },
  submit(e) {
    wx.request({
      url: app.globalData.url+'addzuduiinfo',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        WeldId:this.data.weldid,
        WeldNo: this.data.joint_submit,
        DrawingNo: this.data.drawing_num,
        PipeNo:this.data.spool_num,
        //WelderNo : this.data.WelderNo,
        //在onload中更改为返回userid
        WelderNo : (this.data.UserId).toString(),
        Contractor: this.data.Contractor,
        //Wps : this.data.wps_submit,
        Wps : '默认',
        WeldDate : this.data.currenTime,
        Longitude: this.data.longitude,
        Latitude : this.data.latitude,
        Location : this.data.location_submit
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.statusCode !=200 ){
          wx.showToast({
            title: res.statusCode+"提交失败，请检查数据的完整性",   
            icon: 'none',   
            duration: 2000   
            }) 
        }else{
          var result = JSON.parse(res.data)
          //{"Status":0,"Note":"此焊口有未申请"}
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
    checkboxChange(e) {
      const value = e.detail.value;
      const joint = this.data.joint;
      console.log('joint')
      console.log(joint)
      const prefabAssembly = this.data.prefabAssembly;
      console.log('joint')
      console.log(joint)
      let filteredJoint = [];
      console.log('prefabAssembly')
      console.log(this.data.prefabAssembly)
      if (value == 0) {
        filteredJoint = joint.filter(item => !item.joint.startsWith('FW'));
      } else{
        filteredJoint = joint.filter(item => item.joint.startsWith('FW'));
      }
      console.log('filteredJoint')
      console.log(filteredJoint)
      this.setData({
        jointLocation: filteredJoint
      });
      for(var i in prefabAssembly){
        if(prefabAssembly[i].value == value){
           prefabAssembly[i].checked = true
        }else{
          prefabAssembly[i].checked = false
        }
      }
      console.log('当前缓存为')
      console.log(prefabAssembly)
      wx.setStorageSync('selectedOptions', prefabAssembly );
    },
    checkboxChange_joint:function(e){
    var jointok = this.data.jointLocation;
    var values = e.detail.value;
    var joint_submit = [];
    var drawing_nums = [];
    var weldids = [];
    for (var i = 0; i < values.length; i++) {
      for(var index in jointok){
        if(jointok[index].value == values[i]){
          console.log(jointok[index])
          joint_submit.push(jointok[index].joint);
          drawing_nums.push(jointok[index].drawingnum);
          weldids.push(jointok[index].weldid);
        }
      }
    }
    this.setData({
    radio_state_joint : 'ture',
    joint_submit : joint_submit,
    drawing_num :  drawing_nums,
    weldid : weldids,
    })
  },
    radioChange_wps(e){
      this.setData({
        radio_state_wps : 'ture',
        wps_submit:e.detail.value
      })
  },
    radioChange_location(e){
      //e.detail.value值为index值
      var index = e.detail.value;
      var location = this.data.location[index];
      wx.setStorageSync('locationIndex', index)
      this.setData({
        location_submit:location
    })
},
    onLoad: function (options) {
      var lists = []
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
        Contractor : app.globalData.subcontractor,
      });
      wx.request({
        url: app.globalData.url+'searchallweldbypipe',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.spool_num},
        success:(res) =>{
          var result = JSON.parse(res.data)
          var data = result   
          //console.log('单管请求结果为')
          //console.log(result)
          //for 循环
          for(let i = 0;i<Object.keys(data).length;i++)
          {
            var object = new Object()
            object.value = i
            //引入图纸号
            object.drawingnum = data[i].DrawingNo
            //引入weldid
            object.weldid = data[i].WeldId
            object.joint = data[i].WeldNo
            //增加管径壁厚
            object.Size = data[i].Size
            object.Thickness = data[i].Thickness
            lists.push(object)
          }
          this.setData({
          joint : lists,
          //drawing_num : drawing,
          spool_num : spool,
          }); 
        }, 
        });
        
        //第二次请求
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
    onReady: function (e) {
      let lastSelectedOptions = wx.getStorageSync('selectedOptions');
      var e = {type:"",detail:{value:null}};
      if (!lastSelectedOptions) {
          lastSelectedOptions =[{value: 0, name: '预制',checked : true},{value: 1, name: '总装',checked : false}];
      }
      for(var i in lastSelectedOptions){
        if(lastSelectedOptions[i].checked == true){
          e.detail.value = lastSelectedOptions[i].value
        }
      }
      this.setData({
        prefabAssembly: lastSelectedOptions
      });
      // Create a Promise to wait for the joint data to be available
      const getJointData = new Promise((resolve, reject) => {
      // Check if the joint data has been loaded
      if (this.data.joint.length > 0) {
         resolve();
      } else {
      // Wait for the joint data to be loaded
      const intervalId = setInterval(() => {
        if (this.data.joint.length > 0) {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
      }
      });
      getJointData.then(() => {
        this.checkboxChange(e);
      });
    }
  })