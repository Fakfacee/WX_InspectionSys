var app = getApp()
Page({ 
  data: { 
    phone: '', 
    password:'' ,
    movies:[
      {url:'/pages/image/Login1.jpg'},
      {url:'/pages/image/Login2.jpg'},
      {url:'/pages/image/Login3.jpeg'},
      ]
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
// 登录 
  login: function () { 
    if(this.data.phone.length == 0 || this.data.password.length == 0){ 
      wx.showToast({   
        title: '用户名和密码不能为空',   
        icon: 'none',   
        duration: 2000   
      })   
}else { 
  // 这里修改成跳转的页面 
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
      app.globalData.WelderNo = result.WelderNo
     
      //result.UserId
      
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
    password : wx.getStorageSync('password')
  }) 

}

})