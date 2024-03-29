var util = require('../../../util/util.js')
var app = getApp()
Page({
  data:{
    lastTapTime:0,
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
    isSubmitting:false,
  },
  submit(e) {
      wx.showLoading({
       title: '数据提交中...',
       mask:true
      })
      var now = new Date().getTime();
      if(now - this.data.lastTapTime < 1000){
        wx.hideLoading();
        wx.showToast({
          title: "请勿重复提交",   
          icon: 'none',   
          duration: 2000,
          mask: true   
          });
        return;
      }     
      if(!this.data.location_submit[0]){
        wx.showToast({
          title: "提交失败，请勾选位置信息",   
          icon: 'none',   
          duration: 2000   
          }) 
      }else{
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
        success (res){
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
    }
    this.setData({
      lastTapTime:now
    });
    wx.hideLoading();   
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
      const prefabAssembly = this.data.prefabAssembly;
      let filteredJoint = [];
      //console.log('prefabAssembly')
      //console.log(this.data.prefabAssembly)
      if (value == 0) {
        filteredJoint = joint.filter(item => !item.joint.startsWith('FW'));
      } else{
        filteredJoint = joint.filter(item => item.joint.startsWith('FW'));
      }
      //console.log('filteredJoint')
      //console.log(filteredJoint)
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
      //console.log('当前缓存为')
      //console.log(prefabAssembly)
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
      //wx.setStorageSync('locationIndex', index)
      this.setData({
        location_submit:location.LocationName
    })
},
    onLoad: function (options) {
      wx.showLoading({
        title: '数据加载中..',
        mask:true
      });    
      var lists = [];
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
      //request三端口合并
      wx.request({
        url: app.globalData.url+'searchbypipe_fit',
        method : 'POST',
        dataType:'JSON',
        data:{value:'0',spool:that.spool_num},
        success:(res)=>{
          var result = JSON.parse(res.data)
          var status = result[0].status
          //查询无此单管
          if(status[0].Status == 0){
            wx.showToast({
              title: status.Note,
              icon: 'none',   
              duration: 2000,   
            })
          }else if(status[0].Status == 1){
            var weld = result[1].weld
            var location = result[2].location
            //添加焊口信息
            for(let i = 0;i<Object.keys(weld).length;i++)
          {
            var object = new Object()
            object.value = i
            //引入图纸号
            object.drawingnum = weld[i].DrawingNo
            //引入weldid
            object.weldid = weld[i].WeldId
            object.joint = weld[i].WeldNo
            //增加管径壁厚
            object.Size = weld[i].Size
            object.Thickness = weld[i].Thickness
            lists.push(object)
          }

          this.setData({
            joint : lists,
            //drawing_num : drawing,
            spool_num : spool,
            location : location,
          })
          }else if(status[0].Status == 2){
          wx.showToast({
            title: status[0].Note,
            icon: 'none',   
            duration: 2000 
          })

          }
          wx.hideLoading();
        },
        fail: function(res) {
          wx.showToast({
            title: "访问失败，当前网络连接不可用",   
            icon: 'none',   
            duration: 2000   
            }) 
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