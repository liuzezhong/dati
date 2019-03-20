// pages/test/result/result.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperId: 1,  // 试卷id
    paperToken: "6506191633277300",
    memberId: 1,
    resultInfo: null,
    fayue_skey: null,
    money: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.paperId) {
      this.setData({
        paperId: options.paperId,
        paperToken: options.paperToken,
      });
    }


    var that = this;
    wx.showLoading({
      title: '正在加载中',
    })

    if (options.fayue_skey) {
      this.setData({
        fayue_skey: options.fayue_skey,
      });

      $.post(
        'question315/result',
        {
          memberId: wx.getStorageSync('memberId'),
          paperId: this.data.paperId,
          token: this.data.paperToken,
          skey: options.fayue_skey,
        },
        function (res) {
          console.log(res);
          if(res.data.data.status == -1) {
            // 保障金获取失败
            that.setData({
              resultInfo: res.data.data,
              money: -1,
            });
            wx.showToast({
              title: '每日仅首次挑战可领取保障金',
              icon: 'none'
            })
          } else if(res.data.data.status == 0) {
            that.setData({
              resultInfo: res.data.data,
              money: res.data.data.correctCount * 20,
            });
          }
          
          wx.hideLoading();
        }
      )
    } else {
      $.post(
        'result',
        {
          memberId: wx.getStorageSync('memberId'),
          paperId: this.data.paperId,
          token: this.data.paperToken,
        },
        function (res) {
          console.log(res);
          that.setData({
            resultInfo: res.data.data,
          });
          wx.hideLoading();
        }
      )


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
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    var that = this;
    if (this.data.fayue_skey != null) {
      $.post(
        'question315/shareResult',
        {
          memberId: wx.getStorageSync('memberId'),
          paperId: that.data.paperId,
          token: that.data.paperToken,
          skey: that.data.fayue_skey,
        },
        function (res) {
          console.log(res);
          if (res.data.data.status == 1) {
            wx.showToast({
              title: '保障金+' + res.data.data.add,
              icon: 'none',
            })
          } else {
            wx.showToast({
              title: '转发失败',
              icon: 'none',
            })
          }
        }
      )
      return {
        title: '《消法》知识答题赢取315元现金红包',
        path: '/pages/test/index/index',
        imageUrl: 'http://imgbj.xianshikeji.com/315zhuanfa.jpg',
      }
    }else {
      $.post(
        'shareResult',
        {
          memberId: wx.getStorageSync('memberId'),
          paperId: that.data.paperId,
          token: that.data.paperToken,
        },
        function (res) {
          console.log(res);
          if (res.data.data.status == 1) {
            wx.showToast({
              title: '积分+' + res.data.data.add,
              icon: 'none',
              success: function () {
                var resultInfo = that.data.resultInfo;
                resultInfo.integral = res.data.data.integral;
                that.setData({
                  resultInfo: resultInfo,
                });
              }
            })

          }
        }
      )
      return {
        title: '来答题闯关赢取现金红包',
        path: '/pages/index/index',
      }
    }

  },

  bindRank: function (e) {
    wx.navigateTo({
      url: '../rank/rank?paperId=' + this.data.paperId + '&paperToken=' + this.data.paperToken,
    })
  },

  bindAgain: function (e) {
    wx.navigateBack({
      delta: 2,
    })
  }
})