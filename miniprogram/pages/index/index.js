//index.js
var util = require('/util.js')
var app = getApp()
Page({
  data: {
    currentTab: 0,
    newIndex: 0,
    hotList: {},
    newList: {},
    num:6,
    page:2,
    page1:2,
    displayMore: false,
    displayLoading: true,
    displayOver: true,
    displayMore1: false,
    displayLoading1: true,
    displayOver1: true,
  },
  onLoad: function() {
    const that = this
      wx.request({
        url: 'https://meng.taropowder.cn/wechat/api/song_list.php',
        data: {
          order: 'listening_times',
          num: that.data.num,
        },
        method: 'GET',
        header: { 'content-Type': 'application/json' },
        success: function (res) {
          app.globalData.songCount = res.data.length;
          that.setData({
            displayLoading: false,
            hotList: res.data,
          })
        }
      }
      );
  },
  nav: function(e) {
    app.globalData.songId = e.target.dataset.id;
    wx.switchTab({
      url: '../listen/listen',
    })
  },
  change:function(tab){
    var that=this
    if (tab == 0) {
      wx.request({
        url: 'https://meng.taropowder.cn/wechat/api/song_list.php',
        data: {
          order: 'listening_times',
          num: that.data.num,
        },
        method: 'GET',
        header: { 'content-Type': 'application/json' },
        success: function (res) {
          that.setData({
            displayMore: false,
            displayLoading: true,
            displayOver: true,
            hotList: res.data,
          })
        }
      });
    }
    else {
      wx.request({
        url: 'https://meng.taropowder.cn/wechat/api/song_list.php',
        data: {
          order: 'creat_time',
          num: that.data.num,
        },
        method: 'GET',
        header: { 'content-Type': 'application/json' },
        success: function (res) {
          that.setData({
            displayMore1: false,
            displayLoading1: true,
            displayOver1: true,
            newList: res.data,
          })
        }
      });
    }
  },
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.change(that.data.currentTab)
  },
  changeTab: function(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
    }
  },
  searchScrollLower1: function() {
    var that = this
    if (!that.data.displayMore1 && that.data.displayOver1) {
      that.fetchSearchList1();
    }
  },
  fetchSearchList1: function () {
    var that = this;
    var myPage1 = that.data.page1
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/song_list.php',
      data: {
        order: 'creat_time',
        num: that.data.num,
        page: myPage1
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        myPage1++
        app.globalData.songCount = app.globalData.songCount + res.data.length;
        let searchList = [];
        var i = 0
        var count = res.data.length
        if (count == 6) {
          searchList = that.data.newList.concat(res.data[i], res.data[i + 1], res.data[i + 2], res.data[i + 3], res.data[i + 4], res.data[i + 5])
          that.setData({
            newList: searchList,
            displayMore1: false,
            displayOver1: true,
            displayLoading1: false,
            page: myPage1
          });
        }
        else {
          for (; i < count; i++) {
            searchList = that.data.newList.concat(res.data[i])
            that.setData({
              newList: searchList
            })
          }
          that.setData({
            displayMore1: true,
            displayOver1: false
          });
        }
      }
    })
  },
  fetchSearchList: function () {
    var that = this;
    var myPage = that.data.page
    wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/song_list.php',
      data: {
        order: 'listening_times',
        num: that.data.num,
        page: myPage
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        myPage++
        app.globalData.songCount = app.globalData.songCount+res.data.length;
        let searchList = [];
        var i =0
        var count = res.data.length
        if (count == 6) {
          searchList = that.data.hotList.concat(res.data[i], res.data[i + 1], res.data[i + 2], res.data[i + 3], res.data[i + 4], res.data[i + 5])
          that.setData({
            hotList: searchList,
            displayMore: false,
            displayOver: true,
            displayLoading: false,
            page: myPage
          });
        }
        else {
          for (; i < count; i++) {
            searchList = that.data.hotList.concat(res.data[i])
            that.setData({
              hotList: searchList
            })
          }
          that.setData({
            displayMore: true,
            displayOver: false
          });
        }
      }
    })
  },
  searchScrollLower: function () {
    let that = this;
    if (!that.data.displayMore && that.data.displayOver) {
      that.fetchSearchList();
    }
    
  },
})