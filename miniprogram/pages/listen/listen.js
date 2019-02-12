//获取应用实例
var app = getApp()
Page({
  data: {
    pauseStatus: true,
    timer: '',
    currentPosition: 0,
    duration: 0,
    showTime: 'none',
    progress: 35,
    isStar: 0,
    audioList: '',
    starBack: 'https://meng.taropowder.cn/GuoYiQiTan/star.png',
    playBack: 'https://meng.taropowder.cn/GuoYiQiTan/play1.png'
  },
  getSong: function() {
    var that=this
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/song.php',
      method: 'GET',
      data: {
        id: app.globalData.songId
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        app.globalData.songId = res.data.id
        that.setData({
          audioList: res.data
        })
        wx.setStorage({
          key: 'lastId',
          data: res.data.id,
        })
      }
    })
  },
  changeMusic: function() {
    if (app.globalData.songId != app.globalData.playId) {
      wx.stopBackgroundAudio();
      this.setData({
        pauseStatus: true,
        playBack: 'https://meng.taropowder.cn/GuoYiQiTan/play1.png',
        currentPosition: 0,
        showTime: 'none',
      })
    }
  },
  onLoad: function() {
    var that = this
    that.changeMusic()
    if (app.globalData.songId == '') {
      var songId = (wx.getStorageSync('lastId'))
      if (songId == '') {
        that.getSong();
      } else {
        app.globalData.songId = songId
        that.getSong();
      }
    } else {
      that.getSong();
    }
    if (app.globalData.openId != '') {
      that.isStarr()
    }
  },
  isStarr: function() {
    var that=this
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/isStar.php',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: app.globalData.songId,
        OpenId: app.globalData.openId
      },
      success: function(res) {
        if (res.data == 1) {
          that.setData({
            isStar: 1,
            starBack: 'https://meng.taropowder.cn/GuoYiQiTan/star1.png',
          })
        }
        else{
          that.setData({
            isStar: 0,
            starBack: 'https://meng.taropowder.cn/GuoYiQiTan/star.png',
          })
        }
      }
    })
  },
  onShow: function(e) {
    var that = this
    that.changeMusic()
    that.getSong()
    if (app.globalData.openId != '') {
      that.isStarr()
    }
  },
  bindSliderchange: function(e) {
    let value = e.detail.value
    let that = this
    wx.getBackgroundAudioPlayerState({
      success: function(res) {
        let {
          status,
          duration
        } = res
        if (status == 1 || status == 0) {
          that.setData({
            sliderValue: value
          })
          wx.seekBackgroundAudio({
            position: value * duration / 100,
          })
        }
      }
    })
  },
  bindTapPlay: function() {
    if (this.data.pauseStatus ===true) {
      this.play()
      app.globalData.playId=app.globalData.songId
      this.setData({
        pauseStatus: false,
        playBack: 'https://meng.taropowder.cn/GuoYiQiTan/pause.png',
      })
    } else {
      wx.pauseBackgroundAudio()
      this.setData({
        pauseStatus: true,
        playBack: 'https://meng.taropowder.cn/GuoYiQiTan/play1.png'
      })
    }
  },
  bindTapChoose: function(e) {
    console.log('bindTapChoose')
    console.log(e)
    this.setData({
      audioIndex: parseInt(e.currentTarget.id, 10),
      listShow: false
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10))
  },
  play() {
    let {
      audioList
    } = this.data
    wx.playBackgroundAudio({
      dataUrl: audioList.mp3,
      title: audioList.name
    })
    let that = this
    let timer = setInterval(function() {
      that.setDuration(that)
    }, 1000)
    this.setData({
      timer: timer
    })
  },
  setDuration(that) {
    wx.getBackgroundAudioPlayerState({
      success: function(res) {
        console.log(res)
        let {
          status,
          duration,
          currentPosition
        } = res
        if (status === 1 || status === 0) {
          that.setData({
            currentPosition: that.stotime(currentPosition),
            duration: that.stotime(duration),
            showTime: 'block',
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
        }
      }
    })
  },
  seiLeft: function(s) {
    var left;
    var that = this;
    left = 685 / s;
    this.setInterval(function() {
      that.setData({
        progress: that.progress + left
      })
    }, 1000)
  },
  stotime: function(s) {
    console.log("time" + s);
    let t = '';
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;

      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },

  onShareAppMessage: function(res) {
    let that = this
    return {
      title: '国医奇谈：' + that.data.audioList.name,
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  },
  star: function() {
    var that = this
    if (app.globalData.openId == '' || userInfo== '' ) {
      wx.showToast({

        title: '请登录后重试',

        image: '../../images/wrong.png',

        duration: 1500

      })
    } else {
      if (that.data.isStar == 1) {
        wx.showToast({

          title: '已经收藏过了',

          image: '../../images/wrong.png',

          duration: 1500

        })
      } else {
        wx.request({
          url: 'https://meng.taropowder.cn/wechat/api/add_collection.php',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            songid: app.globalData.songId,
            openid: app.globalData.openId
          },
          success: function(res) {
            if (res.data.status == 'success') {
              wx.showToast({

                title: '收藏成功',

                icon: 'success',

                duration: 1500

              })
              that.setData({
                isStar: 1,
                starBack: 'https://meng.taropowder.cn/GuoYiQiTan/star1.png',
              })
            } else {
              wx.showToast({

                title: '请稍后重试',

                image: '../../images/wrong.png',

                duration: 1500

              })
            }
          }
        })
      }
    }
  }
})