// pages/test/rank/rank.js

import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 100,
    paperId: 1,  // 试卷id
    paperToken: "6506191633277300",
    memberId: wx.getStorageSync('memberId'),
    rankList: null,
    myRank: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.paperId) {
      this.setData({
        paperId: options.paperId,
      });
    }

    if (options.paperToken) {
      this.setData({
        paperToken: options.paperToken,
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
    console.log(wx.getStorageSync('memberId'));
    console.log(this.data.paperId);
    console.log(this.data.paperToken);
    console.log(this.data.size);
    $.post(
      'paperRanking',
      {
        memberId: wx.getStorageSync('memberId'),
        paperId: this.data.paperId,
        token: this.data.paperToken,
        size: this.data.size,
      },
      function (res) {
        console.log(res);
        if (res.data.data.current) {
          console.log('have');
          that.setData({
            rankList: res.data.data.rankings,
            myRank: res.data.data.current,
          });
        }else {
          console.log('none');
          that.setData({
            rankList: res.data.data.rankings,
          });
        }
        
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

  }
})