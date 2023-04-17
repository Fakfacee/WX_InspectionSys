var app = getApp()
Page({ 
  data: { 
    phone: '', 
    password:'' 
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
    console.log(res)
    try {
      var result = JSON.parse(res.data)
      console.log(result.Status)
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
      app.globalData.class = result.User_Identity,
      app.globalData.class_id = result.PowerId,
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
/** 
  wx.request({
    url: app.globalData.url+'login',
    method : 'POST',
    dataType : 'JSON',
    data: {
    strUser: wx.getStorageSync('phone'),
    strPwd: wx.getStorageSync('password')
    },
    success:(res) =>{
    var result = JSON.parse(res.data)
   
    if(result.Status =='0'){
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
    app.globalData.class = result.User_Identity,
    app.globalData.WelderNo = result.WelderNo,
    app.globalData.class_code = result.PowerId,
    app.globalData.UserId = result.UserId
    //result.UserId
    wx.switchTab({
   
      url: '/pages/main/main_page',
    })

    }
    },
    fail:function()
    { 
    
      wx.showToast({

        title: '登录失败，请重试',   
        icon: 'none',   
        duration: 2000   
        })   

    }
  })
  */
}

})