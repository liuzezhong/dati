// pages/test/index/index.js
import $ from '../../../common/common.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rulesTip: false,
    pageSize: 100,
    pageNumber: 1,
    paperList: null,
    paperToken: null,
    fayue_skey: null,
    isLogin: false,
    paperId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.fayue_skey) {
      this.setData({
        fayue_skey: options.fayue_skey,
      });
    }

    if (wx.getStorageSync('nickname')) {
      this.setData({
        isLogin: true,
        headImgUrl: wx.getStorageSync('headImgUrl'),
        nickname: wx.getStorageSync('nickname'),
      })
    } else {
      this.setData({
        isLogin: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载中',
    })

    $.post(
      'paperList',
      {
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize,
      },
      function (res) {
        console.log(res);
        that.setData({
          paperList: res.data.data.content,
          paperToken: res.data.data.token,
        });
        wx.hideLoading();
      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindSure: function(e) {
    this.setData({
      rulesTip: false,
    });
  },

  bindShowRulesTip: function(e) {
    this.setData({
      rulesTip: true,
    });
  },

  bindRank: function(e) {
    var paperId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../rank/rank?paperId=' + paperId + '&paperToken=' + this.data.paperToken,
    })
  },

  bindPaper: function(e) {
    if(this.data.paperId == 0) {
      var paperId = e.currentTarget.dataset.id;
    }else {
      var paperId = this.data.paperId;
    }
    
    console.log(paperId);
    if (this.data.fayue_skey != null) {
      wx.navigateTo({
        url: '../response/response?paperId=' + paperId + '&paperToken=' + this.data.paperToken + '&fayue_skey=' + this.data.fayue_skey,
      })
    }else {
      wx.navigateTo({
        url: '../response/response?paperId=' + paperId + '&paperToken=' + this.data.paperToken,
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e);
    var userInfo = e.detail.userInfo;
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(userInfo);
    $.post(
      'addMember',
      {
        memberId: wx.getStorageSync('memberId'),
        nickname: userInfo.nickName,
        headImgUrl: userInfo.avatarUrl,
        sex: userInfo.gender,
        country: userInfo.city,
        province: userInfo.province,
        city: userInfo.city,
      },
      function (res) {
        console.log(res.data);
        wx.setStorageSync('memberId', res.data.data.memberId);
        wx.setStorageSync('headImgUrl', res.data.data.headImgUrl);
        wx.setStorageSync('nickname', res.data.data.nickname);
        wx.showToast({
          title: '授权成功，正在打开试卷',
          icon: 'none',
          success: function() {
            setTimeout(function() {
              console.log('dingshiqi ');
              that.setData({
                paperId: id,
              });
              that.bindPaper();
            },2000);
          }
        })
        
      }
    )
  },
})