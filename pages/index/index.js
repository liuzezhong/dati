//index.js
//获取应用实例
import $ from '../../common/common.js';
const app = getApp()

Page({
  data: {
    fayeappid: 'wx1e400c1260bebace',
    lvdouappid: 'wx586501a5b03c99be',
    isLogin: false,
    userInfo: null,
    clickLogin: 0,  // 点击免费领取,
  },
  onLoad: function () {
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

  onShow: function () {

    if (wx.getStorageSync('nickname')) {
      var that = this;
      wx.showLoading({
        title: '正在加载中',
      })
      $.post(
        'getMember',
        {
          memberId: wx.getStorageSync('memberId'),
        },
        function (res) {
          console.log(res);
          that.setData({
            isLogin: true,
            userInfo: res.data.data,
            headImgUrl: wx.getStorageSync('headImgUrl'),
            nickname: wx.getStorageSync('nickname'),
          });
          wx.hideLoading();
        }
      )
    }else {
      this.setData({
        isLogin: false,
      });
    }
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

  bindTest: function(e) {
    // 答题测试

    if (this.data.isLogin == false) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
    }else {
      wx.navigateTo({
        url: '../test/index/index',
      })
    }
    
  },

  bindRank: function(e) {
    // 排行榜
    // wx.showToast({
    //   title: '暂未开放，敬请期待',
    //   icon: 'none',
    // })
    wx.navigateTo({
      url: '../test/rank/rank?paperId=4',
      icon:'none'
    })
  },

  bindChallenge: function (e) {
    // 答题挑战
    if (this.data.isLogin == false) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
    } else {
      wx.showToast({
        title: '暂未开放，敬请期待',
        icon: 'none',
      })
    }
    
  },

  bindSign: function (e) {
    // 签到有奖
    if (this.data.isLogin == false) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
    } else {
      // wx.showToast({
      //   title: '签到成功+10积分',
      //   icon: 'none',
      // })
      wx.showToast({
        title: '暂未开放，敬请期待',
        icon: 'none',
      })
    }
    
  },

  bindDraw: function (e) {
    // 幸运抽奖
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon: 'none',
    })
  },

  bindProp: function (e) {
    // 道具
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon: 'none',
    })
  },

  bindQuestion: function (e) {
    // 题库
    // wx.showToast({
    //   title: '暂未开放，敬请期待',
    //   icon: 'none',
    // })
  },

  bindTask: function (e) {
    // 任务中心
    wx.showToast({
      title: '暂未开放，敬请期待',
      icon: 'none',
    })
  },

  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    var that = this;
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
        that.onShow();
      }
    )
  },
})
