var app = getApp()
Page({ 
  data: {
    options: ['HZ26-6','XJ30-2','PY10-1&11-12','WC19-1&9-7'],
    //防止跨项目误操作，取消默认勾选
    //selectedValue: 0, // 当前选中的值的索引
    selectedOption: '项目选择', // 当前选中的值 
    selectedValue : null,
    phone: '', 
    password:'' ,
    movies:[
      {url:'/pages/image/Login1.jpg'},
      {url:'/pages/image/Login2.jpg'},
      {url:'/pages/image/Login3.jpeg'},
      ],
  }, 
 
//访客模式登录
  visitor :function(e){
  //姓名
  app.globalData.name = '浏览访客',
  //承包商
  app.globalData.subcontractor =  null,
  //User_Identity 身份信息 QC Welder
  app.globalData.class = null,
  //用于提交QC信息
  app.globalData.class_id = null,
  //class_code 区分界面显示
  app.globalData.class_code = 1,
  app.globalData.WelderNo = null
  wx.switchTab({
    url: '/pages/main/main_page',
  })
  },
// 获取输入账号 
  phoneInput :function (e) { 
    this.setData({ 
      phone:e.detail.value 
    }) 
    wx.setStorageSync('phone', e.detail.value)
  }, 
// 获取输入密码 
  passwordInput :function (e) { 
    this.setData({ 
      password:e.detail.value 
    })
    wx.setStorageSync('password', e.detail.value)   
  }, 
  
  onPickerChange: function (e) {
    wx.setStorageSync('optionIndex', e.detail.value)
    const index = e.detail.value; // 获取选中的索引
    const option = this.data.options[index]; // 获取选中的值
    this.setData({
      selectedValue: index,
      selectedOption: option

    });
    if(option == 'HZ26-6'){
      app.globalData.url = app.globalData.url_HZ
    }else if(option == 'XJ30-2'){
      app.globalData.url = app.globalData.url_XJ
    }else if(option == 'PY10-1&11-12'){
      app.globalData.url = app.globalData.url_PY
    }else if(option == 'WC19-1&9-7'){
      app.globalData.url = app.globalData.url_WC
    }
  },
   
// 登录 
  login: function () { 
    if(this.data.phone.length == 0 || this.data.password.length == 0){ 
      wx.showToast({   
        title: '用户名和密码不能为空',   
        icon: 'none',   
        duration: 2000   
      })   
}else { 
  wx.request({
    url: app.globalData.url+'login',
    method : 'POST',
    dataType : 'JSON',
    data: {
    strUser:this.data.phone,
    strPwd:this.data.password
    },
    success:(res) =>{
    try {
      var result = JSON.parse(res.data)
      //Status,UserId,Name,User_Identity,Contractor,Email,PhoneNo,PowerId,WelderNo
      if(result.Status == '0'){
        wx.showToast({
          title: '用户名不存在,请进行注册',   
          icon: 'none',   
          duration: 2000   
          })   
      }else if(result.Status =='1'){
      //姓名
      app.globalData.name = result.Name,
      //承包商
      app.globalData.subcontractor =  result.Contractor,
      //User_Identity 身份信息 QC Welder
      app.globalData.class = result.User_Identity,
      //用于提交QC信息
      app.globalData.class_id = result.UserId,
      //class_code 区分界面显示
      app.globalData.class_code = result.PowerId,
      app.globalData.WelderNo = result.WelderNo,
      app.globalData.isLogin = true 
      wx.switchTab({
        url: '/pages/main/main_page',
      })
      }
    }catch(Exception){
      wx.showToast({
        title: '与服务器连接失败，请重新尝试',   
        icon: 'none',   
        duration: 2000   
        }) 
    }
    },
    fail:function(){
      wx.showToast({
        title: '无法连接服务器',   
        icon: 'none',   
        duration: 2000   
        }) 
      }
  }) 
    }   
  },
  registe: function () { 
  wx.navigateTo({
    url: '../register/register',
  })
  },

onLoad: function (options){
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
  })
  this.setData({ 
    phone: wx.getStorageSync('phone'),
    password : wx.getStorageSync('password'),
    
  })
  if (!getApp().globalData.isLogin) {
    wx.redirectTo({
      url: '/pages/main/login/login'
    })
    app.globalData.isLogin = true
  }
},
/** 
onReady(){
//构造模拟事件
var e = {type:"",detail:{value:null}};
let optionIndex = wx.getStorageSync('optionIndex');
if (!optionIndex) {
  e.detail.value = 0
}else{
  e.detail.value = optionIndex
}
//根据历史缓存，刷新显示
this.onPickerChange(e)
}
*/
})
