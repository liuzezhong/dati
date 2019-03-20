//app.js
import $ from 'common/common.js';
App({
  onLaunch: function (res) {
    console.log(res);
    wx.checkSession({

      success: function (res) {
        console.log('wx.checkSession success');
        if (!wx.getStorageSync('memberId')) {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var that = this;
              console.log(res.code);
              $.post(
                'toGetOpenId',
                {
                  code: res.code
                },
                function (res) {
                  console.log('***********openid*********');
                  console.log(res.data);
                  console.log('***********openid*********');
                  wx.setStorageSync('memberId', res.data.data.memberId)
                }
              )
            }
          })
        }

      },
      fail: function (res) {
        console.log('wx.checkSession fail');
        wx.login({
          success: res => {
            console.log(res.code);
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var that = this;
            $.post(
              'toGetOpenId',
              {
                code: res.code
              },
              function (res) {
                wx.setStorageSync('memberId', res.data.data.memberId)
              }
            )
          }
        })
      }
    });



    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId

              var userInfo = res.userInfo;
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
                  wx.setStorageSync('memberId', res.data.data.memberId);
                  wx.setStorageSync('headImgUrl', res.data.data.headImgUrl);
                  wx.setStorageSync('nickname', res.data.data.nickname);
                }
              )
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})