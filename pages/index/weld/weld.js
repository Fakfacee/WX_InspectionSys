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
    radio_state_result:false,
    wps_submit :[],
    WelderNo:[],
    drawing_num:'',
    spool_num:'',
    Contractor:[],
    jointOk: [
    ],
    jointNotOk : [
    ],
    weldid:[],
    inputList: [],
    wps: [],
    location: [],
    status:[
      {value: true, name: '是'},
      {value: false, name: '否',checked :true},
    ],
  },
  addwelder: function() {
    var inputList = this.data.inputList;
    inputList.push('');
    this.setData({
      inputList: inputList
    });
  },
  inputChange: function(event) {
    var inputList = this.data.inputList;
    var index = event.currentTarget.dataset.index;
    inputList[index] = event.detail.value;
    this.setData({
      inputList: inputList
    });
  },
  submit(e) {
    //合并当前焊工信息
    //inputlist = [0:welde1,1:welder:2]
    if(this.radio_state_result){
      var welderlist = []
      var inputlist = this.data.inputList
      welderlist.push(this.data.WelderNo)
      for(var i in inputlist){
      welderlist.push(inputlist[i])
      }
    }else{
      var welderlist = []
      welderlist.push(this.data.WelderNo)
    }
    wx.request({
      url: app.globalData.url+'addweldinginfo',
      method : 'POST',
      //data:that.spool_num,
      dataType : 'JSON',
      data: {
        WeldId : this.data.weldid,
        WeldNo: this.data.joint_submit,
        DrawingNo: this.data.drawing_num,
        PipeNo:this.data.spool_num,
        WelderNo : welderlist,
        Contractor: this.data.Contractor,
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
        if(res.statusCode !=200 ){
          wx.showToast({
            title: res.statusCode+"提交失败，请检查数据的完整性",   
            icon: 'none',   
            duration: 2000   
            }) 
        }else{
        var result = JSON.parse(res.data)
        //{"Status":0,"Note":"此焊口有未申请"}
        console.log('-------焊接信息提交返回code------------')
        console.log(res.statusCode)
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
      fail: function(res) {
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
    var jointok = this.data.jointOk
    var values = e.detail.value
    var joint_submits = [];
    var drawing_nums = [];
    var weldids = [];
    for (let i = 0;i<values.length;i++) {
        const value = values[i]
        joint_submits.push(jointok[value].joint)
        drawing_nums.push(jointok[value].drawingnum)
        weldids.push(jointok[value].weldid)
      
    }
    this.setData({
    radio_state_joint : 'ture',
    joint_submit : joint_submits,
    drawing_num :  drawing_nums,
    weldid : weldids,
    })
  },
    radioChange_wps(e){
      var index = e.detail.value
      var wps = this.data.wps[index]
      console.log(wps)
      this.setData({
        wps_submit:wps
      })
  },
    radioChange_location(e){
      var index = e.detail.value;
      var location = this.data.location[index];
      this.setData({
        location_submit:location.LocationName
    })
},
radio_state_result(e){
  if(e.detail.value == 'true'){
    this.setData({
      radio_state_result : true,
    })
  }else{
    this.setData({
      radio_state_result : false,
      inputList: [],
    })
  }

},
    onLoad: function (options) {
      var that = this;
      var spool = options.spool;
      //var array = JSON.parse(options.spool);
      // 调用函数时，传入new Date()参数，返回值是日期和时间
      var currenTime= util.formatTime(new Date());
      var listsCanNotWeld = []
      var listsCanWeld = []
      // 再通过setData更改Page()里面的data，动态更新页面的数据
      this.setData({
        currenTime: currenTime,
        spool_num : spool,
        WelderNo : app.globalData.WelderNo,
        Contractor : app.globalData.subcontractor,
      });
      //console.log('------请求满足焊接检验条件焊口-----')
      wx.request({
        url: app.globalData.url+'searchbypipe_welding',
        method : 'POST',
        dataType : 'JSON',
        data:{value :'0',spool:that.data.spool_num},
        success:(res) =>{
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
            var wps = result[3].location
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
            //引入材质
            object.Material = weld[i].Material
            if(data[i].IfWelding == 0){
              listsCanNotWeld.push(object)
            }else{
              listsCanWeld.push(object)
            }
          }
        //合并项处理
          that.setData({
          jointOk : listsCanWeld,
          jointNotOk : listsCanNotWeld,
          drawing_num : drawing,
          spool_num : spool,
          location:location,
          wps:wps
          }); 
        }else if(status[0].Status == 2){
          wx.showToast({
            title: status[0].Note,
            icon: 'none',   
            duration: 2000 
          })

          } 
        },
        fail: function(res) {
          wx.showToast({
            title: "访问失败，当前网络连接不可用",   
            icon: 'none',   
            duration: 2000   
            }) 
        }
        });
    },

    //地图函数，待完善
    onReady: function (e) {
      this.checkJointOk()

    }
  })