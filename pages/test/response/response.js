// pages/test/response/response.js
import $ from '../../../common/common.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerWrong: false,
    paperId: 1,  // 试卷id
    paperToken: "6506191633277300",
    memberId: 1,
    sequence: 1, // 第几题
    questionInfo: null,
    chooseWrong: 0,// 0未选择，1选对，-1选错
    chooseOption: 'D',
    countDown: 16,
    recursion: 0,
    timeoutID: 0,
    fayueAppID: 'wx1e400c1260bebace',
    headImgUrl: '',
    nickname: '',
    baginShow: false,
    readyTime: 5,
    fayueArray: { "sence": '10-1-762-0' },
    fayue_skey: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fayue_skey) {
      console.log('fayue_skey');
      console.log(options.fayue_skey);
      this.setData({
        fayue_skey: options.fayue_skey,
      });
    }
    if (options.paperId) {
      this.setData({
        paperId: options.paperId,
        paperToken: options.paperToken,
      });
    }

    if (wx.getStorageSync('nickname')) {
      this.setData({
        headImgUrl: wx.getStorageSync('headImgUrl'),
        nickname: wx.getStorageSync('nickname'),
      })
    } else {
      var that = this;

      $.post(
        'getMember',
        {
          memberId: wx.getStorageSync('memberId'),
        },
        function (res) {
          that.setData({
            userInfo: res.data.data,
            headImgUrl: res.data.data.headImgUrl,
            nickname: res.data.data.nickname,
          });

        }
      )
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (this.data.readyTime > 1) {
      // 未开始答题
      this.setData({
        baginShow: true,
      })
      that.readyTime();
    } else {
      this.setData({
        baginShow: false,
      })
      wx.showLoading({
        title: '正在加载中',
      })
      clearTimeout(this.data.timeoutID);
      console.log('paperID:' + this.data.paperId);
      console.log('token:' + this.data.paperToken);
      console.log('sequence:' + this.data.sequence);
      console.log('memberId:' + wx.getStorageSync('memberId'));
      console.log(that.data.fayue_skey);
      if (that.data.fayue_skey != null) {
        $.post(
          'question315/nextQuestion',
          {
            memberId: wx.getStorageSync('memberId'),
            paperId: this.data.paperId,
            token: this.data.paperToken,
            skey: this.data.fayue_skey,

          },
          function (res) {
            console.log(res);
            if (res.data.data.status == 1) {
              var sence = '10-0-' + res.data.data.fayueId + '-0';
              var fayueArray = { "sence": sence };
              console.log(sence);
              that.setData({
                questionInfo: res.data.data,
                paperInfo: res.data.data.paper,
                countDown: res.data.data.paper.countDown,
                timeoutID: 0,
                fayueArray: fayueArray,
              });
              wx.hideLoading();
              that.countDown();

            } else if (res.data.data.status == 0) {
              // 最后一题了
              wx.hideLoading();

              wx.redirectTo({
                url: '../result/result?paperId=' + that.data.paperId + '&paperToken=' + that.data.paperToken + '&fayue_skey=' + that.data.fayue_skey,
              })
            }
          }
        )
      } else {
        $.post(
          'nextQuestion',
          {
            memberId: wx.getStorageSync('memberId'),
            paperId: this.data.paperId,
            token: this.data.paperToken,
            sequence: this.data.sequence,

          },
          function (res) {
            console.log(res);
            if (res.data.data.status == 1) {
              var sence = '10-0-' + res.data.data.fayueId + '-0';
              var fayueArray = { "sence": sence };
              console.log(sence);
              that.setData({
                questionInfo: res.data.data,
                paperInfo: res.data.data.paper,
                countDown: res.data.data.paper.countDown,
                timeoutID: 0,
                fayueArray: fayueArray,
              });
              wx.hideLoading();
              that.countDown();

            } else if (res.data.data.status == 0) {
              // 最后一题了
              wx.hideLoading();

              wx.redirectTo({
                url: '../result/result?paperId=' + that.data.paperId + '&paperToken=' + that.data.paperToken,
              })
            }
          }
        )
      }

    }
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
  onShareAppMessage: function () {
    var that = this;
    if (this.data.fayue_skey != null) {
      return {
        title: '《消法》知识答题赢取315元现金红包',
        path: '/pages/test/index/index',
        imageUrl: 'http://imgbj.xianshikeji.com/315zhuanfa.jpg',
        success: function (e) {

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
        },
      }
    } else {
      return {
        title: '来答题闯关赢取现金红包',
        path: '/pages/index/index',
        success: function (e) {
          console.log('转发成功success');
          console.log('memberId:' + wx.getStorageSync('memberId'));
          console.log('paperId:' + that.data.paperId);
          console.log('token:' + that.data.paperToken);
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
        },
      }
    }
  },

  bindNext: function (e) {
    console.log('fayueArray' + this.data.fayueArray);
    this.setData({
      answerWrong: false,
      sequence: this.data.sequence + 1,
      chooseWrong: 0,// 0未选择，1选对，-1选错
      chooseOption: 'D',
    });
    this.onReady();
  },

  bindChoose: function (e) {
    console.log(e);
    var that = this;
    var thats = this;
    var content = e.currentTarget.dataset.content;
    var chooseOption = e.currentTarget.dataset.chooseoption;
    var timeoutID = this.data.timeoutID;
    console.log(that.data.fayue_skey);
    // 请求判断正确结果
    if (that.data.fayue_skey != null) {
      $.post(
        'question315/commitAnswer',
        {
          memberId: wx.getStorageSync('memberId'),
          questionId: this.data.questionInfo.questionId,
          token: this.data.paperToken,
          answer: content,
          skey: this.data.fayue_skey,
        },
        function (res) {
          console.log(res);
          if (res.data.data.result == 0) {
            // 答对了
            that.setData({
              chooseWrong: 1,
              chooseOption: chooseOption,
            });
            clearTimeout(timeoutID);
            setTimeout(function () {
              thats.setData({
                sequence: that.data.sequence + 1,
                chooseWrong: 0,// 0未选择，1选对，-1选错
                chooseOption: 'D',
              });
              thats.onReady();
            }, 500);
          } else if (res.data.data.result == 1) {
            that.setData({
              chooseWrong: -1,
              chooseOption: chooseOption,
            });
            clearTimeout(timeoutID);
            setTimeout(function () {
              thats.setData({
                answerWrong: true,
              });
            }, 500);
          }
          wx.hideLoading();
        }
      )
    } else {
      $.post(
        'commitAnswer',
        {
          memberId: wx.getStorageSync('memberId'),
          questionId: this.data.questionInfo.questionId,
          token: this.data.paperToken,
          answer: content,
        },
        function (res) {
          console.log(res);
          if (res.data.data.result == 0) {
            // 答对了
            that.setData({
              chooseWrong: 1,
              chooseOption: chooseOption,
            });
            clearTimeout(timeoutID);
            setTimeout(function () {
              thats.setData({
                sequence: that.data.sequence + 1,
                chooseWrong: 0,// 0未选择，1选对，-1选错
                chooseOption: 'D',
              });
              thats.onReady();
            }, 500);
          } else if (res.data.data.result == 1) {
            that.setData({
              chooseWrong: -1,
              chooseOption: chooseOption,
            });
            clearTimeout(timeoutID);
            setTimeout(function () {
              thats.setData({
                answerWrong: true,
              });
            }, 500);
          }
          wx.hideLoading();
        }
      )
    }







    // if (content == this.data.questionInfo.correctOption) {
    //   // 正确
    //   that.setData({
    //     chooseWrong: 1,
    //     chooseOption: chooseOption,
    //   });
    //   setTimeout(function () {
    //     that.setData({
    //       sequence: that.data.sequence + 1,
    //       chooseWrong: 0,// 0未选择，1选对，-1选错
    //       chooseOption: 'D',
    //       countDown: 15,
    //       recursion: 1,
    //     });
    //     that.onShow();
    //   }, 500);
    // } else {
    //   that.setData({
    //     chooseWrong: -1,
    //     chooseOption: chooseOption,
    //     recursion: 1,
    //   });
    //   setTimeout(function () {
    //     that.setData({
    //       answerWrong: true,
    //     });
    //   }, 500);
    // }
  },

  countDown: function () {
    //获取当前时间  

    var that = this;
    //将倒计时赋值到div中
    this.setData({
      countDown: this.data.countDown - 1,
    });
    // 递归每秒调用countTime方法，显示动态时间效果 
    if (this.data.countDown > 0) {
      console.log(this.data.countDown + '-' + this.data.recursion);
      var timeoutID = setTimeout(this.countDown, 1000);
      console.log('timeoutID:' + timeoutID);
      that.setData({
        timeoutID: timeoutID,
      });
    } else {
      that.setData({
        chooseWrong: -1,
        chooseOption: 'D',
        recursion: 0,
      });
      clearTimeout(timeoutID);
      setTimeout(function () {
        that.setData({
          answerWrong: true,
        });
      }, 500);
      return;
    }
  },

  readyTime: function () {
    var that = this;
    if (this.data.readyTime > 1) {
      // 未开始答题

      var readyTime = this.data.readyTime - 1;
      this.setData({
        readyTime: readyTime,
      });
      setTimeout(that.onReady, 1000);
    } else {
      this.setData({
        baginShow: false,
      })
      this.onReady();
    }
  },
})