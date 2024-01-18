// app.js
App({
globalData:{
//用户基本信息
name:['登陆后显示个人信息'],
subcontractor:[''],
class :[''],
class_code : null,
class_id : [''],
openid : [''],
WelderNo : [''],
UserId : [''],
url:null,
isLogin: false ,
//上线测试
//url_HZ : ['https://cyhdl1ttleyuming.cn/wx2/HZ26-6/'],
//url_XJ : ['https://cyhdl1ttleyuming.cn/wx2/XJ30-2/'],
//url_PY : ['https://cyhdl1ttleyuming.cn/wx2/PY/'],
//url_WC : ['https://cyhdl1ttleyuming.cn/wx2/WC/'],
//本地测试
url_HZ : ['http://127.0.0.1:8080/wx/'],
url_XJ : ['http://127.0.0.1:8081/wx/'],
url_WC : ['http://127.0.0.1:8080/wx/']
},
  onLaunch: function () {
  },
  onUnload: function (){
  let username = wx.getStorageSync('phone');
  let password = wx.getStorageSync('password');
  wx.clearStorageSync(); // 清除除账号和密码以外的缓存数据
  wx.setStorageSync('username', username); // 重新存储账号
  wx.setStorageSync('password', password); // 重新存储密码
  getApp().globalData.isLogin = false // 将登录状态设置为未登录
  }
})
