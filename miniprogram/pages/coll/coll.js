// miniprogram/pages/coll/coll.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colls: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCol();
  },
  getCol:function(){
    var that=this
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/get_collection.php',
      method: 'GET',
      data: {
        openid: app.globalData.openId
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          colls: res.data
        })
      },
    })
  },
  del:function(e){
    var that=this
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/delete_collection.php',
      method: 'GET',
      data: {
        openid: app.globalData.openId,
        songid: e.target.dataset.id
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if(res.data.status=='success'){
          wx.showToast({

            title: '删除成功',

            icon: 'success',

            duration: 1500

          })
          that.getCol();
        }
        else{
          wx.showToast({

            title: '请稍后重试',

            image: '../../images/wrong.png',

            duration: 1500

          })
        }
      },
    })
  },
  onShow:function(){
    this.getCol();
  },
})