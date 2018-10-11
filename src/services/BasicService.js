"use strict";

import axios from "axios";

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (
    response &&
    (response.status === 200 ||
      response.status === 304 ||
      response.status === 400)
  ) {
    return response;
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: "网络异常"
  };
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.msg);
  }
  if (res.data && !res.data.success) {
    alert(res.data.error_msg);
  }
  return res;
}

export default {
  get(url, params) {
    return axios({
      method: "GET",
      url: "http://www.kaishustory.com:8181/tapi/homeservice/layout?userid",
      timeout: 10000,
      headers: {
        token: "123"
      }
    })
      .then(response => {
        //return checkStatus(response);
      })
      .then(res => {
        //return checkCode(res);
      });
  }
};
