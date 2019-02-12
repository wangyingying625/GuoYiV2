// miniprogram/pages/play/play.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    songName: '',
    songImg:'',
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
        songName: options.songName,
        songImg: options.songImg
    })
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/get_comment.php',
      method: 'GET',
      data: {
        songid: app.globalData.songId
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          comments: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  bindKeyInput: function(e) {
    var that = this;
    this.setData({
      inputValue: e.detail.value
      //将input至与data中的inputValue绑定
    })
  },
  submit: function(e) {
    var that = this;
    if (e.detail.value.comment == '') {
      wx.showToast({

        title: '没有评论内容',

        image: '../../images/wrong.png',

        duration: 1500

      })

      setTimeout(function() {

        wx.hideToast()

      }, 2000)
      return;
    } else {
      if (app.globalData.userInfo == '') {
        wx.showToast({

          title: '请登录',

          image: '../../images/wrong.png',

          duration: 1500

        })

        setTimeout(function() {

          wx.hideToast()

        }, 2000)
        return;
      } else {
        console.log("openID" + app.globalData.openId)
        wx.request({
          url: 'https://meng.taropowder.cn/wechat/api/add_comment.php',
          data: {
            comment: e.detail.value.comment,
            songid: app.globalData.songId,
            OpenId: app.globalData.openId
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log(res.data)
            if (res.data.status == 'success') {
              that.setData({
                inputValue: ''
              })
              wx.showToast({

                title: '评论成功',

                icon: 'success',

                duration: 1500

              })
              return;
            } else {
              wx.showToast({

                title: '请稍后重试',

                image: '../../images/wrong.png',

                duration: 1500

              })
            }
          }
        });
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})