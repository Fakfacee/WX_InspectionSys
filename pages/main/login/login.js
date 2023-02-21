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
        icon: 'loading',   
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
    var result = JSON.parse(res.data)
    console.log('success')
    console.log(result.Status)
    if(result.Status =='0'){
    wx.showToast({

      title: '用户名不存在,请进行注册',   
      icon: 'loading',   
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
    //result.UserId
    wx.switchTab({
   
      url: '/pages/main/main_page',
    })

    }

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
    console.log('success')
    console.log(result.Status)
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
    app.globalData.class_id = result.UserId,
    app.globalData.class_code = result.PowerId,
    //result.UserId
    wx.switchTab({
   
      url: '/pages/main/main_page',
    })

    }
    },
    fail:(res) =>{
    
      wx.showToast({

        title: '登录失败，请重试',   
        icon: 'none',   
        duration: 2000   
        })   

    }
  })
}

})