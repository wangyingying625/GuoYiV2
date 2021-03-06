// miniprogram/pages/geRen/geRen.js
const app = getApp()
Page({

      /**
       * 页面的初始数据
       */
      data: {
        nickName: '',
        avatarUrl: '',
        getUserInfoFail: false,
        userName: '匿名'
      },
      setUserInfo: function() {
        var that=this
        wx.request({
          url: 'https://meng.taropowder.cn/wechat/api/get_username.php',
          data: {
            userName: app.globalData.userInfo.nickName,
            userImg: app.globalData.userInfo.avatarUrl,
            OpenId: app.globalData.openId
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
          }
        })
      },
      onLoad: function() {
        wx.clearStorage()
        var that = this;
        var openId = (wx.getStorageSync('openId'));
        if (openId) {
          console.log("if")
          app.globalData.openId = wx.getStorageSync('openId')
          wx.getUserInfo({
                success: function(res) {
                  const userInfo = res.userInfo
                  that.setData({
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    userName: userInfo.nickName
                  })
                  app.globalData.userInfo = userInfo;
                  that.setUserInfo()
                },
                fail: function() {
                  that.setData({
                    getUserInfoFail: true,
                    nickName: '',
                    avatarUrl: ''
                  })
                },
              })
        }
              //没有缓存openId的情况












              else {
                console.log("else")
                wx.login({
                  success: function(res) {
                    if (res.code) {
                      wx.request({
                        //后s台接口地址
                        url: 'https://meng.taropowder.cn/wechat/api/login.php',
                        data: {
                          code: res.code,
                        },
                        method: 'GET',
                        header: {
                          'content-type': 'application/json'
                        },
                        //request的success
                        success: function(res) {
                          wx.setStorageSync('openId', res.data.openid);
                          app.globalData.openId = res.data.openid
                          console.log(app.globalData.openId)
                          wx.getUserInfo({
                            success: function (res) {
                              const userInfo = res.userInfo
                              that.setData({
                                nickName: userInfo.nickName,
                                avatarUrl: userInfo.avatarUrl,
                                userName: userInfo.nickName
                              })
                              app.globalData.userInfo = userInfo;
                              that.setUserInfo()
                            },
                            fail: function () {
                              that.setData({
                                getUserInfoFail: true,
                                nickName: '',
                                avatarUrl: ''
                              })
                            },
                          })
                        }
                      })
                    }
                  }
                })
                //login的success结束
              }
            },
            /**
             * 生命周期函数--监听页面加载
             */

            /*生命周期函数--监听页面初次渲染完成
             */
            onReady: function() {

            },
            openSetting: function() {
              wx.showToast({

                title: '您还没有登录',

                icon: 'none',

                duration: 1500

              })

              setTimeout(function() {

                wx.hideToast()

              }, 2000)
              return;





            },

            getUserInfoo: function(e) {
              app.globalData.openId = wx.getStorageSync('openId')
              var openId = wx.getStorageSync('openId')
              var that = this;
              if (e.detail.userInfo) {
                app.globalData.userInfo = e.detail.userInfo
                this.setData({
                  nickName: e.detail.userInfo.nickName,
                  avatarUrl: e.detail.userInfo.avatarUrl,
                  userName: e.detail.userInfo.nickName,
                  getUserInfoFail: false,
                  hasUserInfo: true,
                })
                that.setUserInfo()
              } else {
                this.setData({
                  getUserInfoFail: true,
                  hasUserInfo: false,
                })
                this.openSetting();
              }

            },
            /**
             * 生命周期函数--监听页面显示
             */
            coll: function() {
              var that = this;
              if (app.globalData.openId == '' || app.globalData.userInfo == '') {
                wx.showToast({

                  title: '您还没有登录',

                  icon: 'none',

                  duration: 1500

                })

                setTimeout(function() {

                  wx.hideToast()

                }, 2000)
                return;
              } else {
                wx.navigateTo({
                  url: '../coll/coll?id=' + that.data.id,
                })
              }
            },
            onShow: function() {

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

            /**
             * 用户点击右上角分享
             */
            onShareAppMessage: function() {

            }
        })