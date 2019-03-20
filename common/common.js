import config from 'config.js';
export default {
  'post': function (url, data, successcallback) {
    wx.request({
      url: config.server + url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: successcallback
    });
  },
  'get': function () {

  },
}