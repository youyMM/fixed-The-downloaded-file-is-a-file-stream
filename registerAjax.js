import Vue from "vue";
import axios from "axios";
import qs from "qs";

axios.interceptors.request.use(function(config) {
  const token = localStorage.getItem("ACCESS_TOKEN");
  let urlArray = ["/auth/captcha/base64", "/login"];
  let url = config.url.split("?")[0].split("/api")[1];
  if (token && urlArray.indexOf(url) == -1) {
    config.headers["Authorization"] = "Bearer " + token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    if (config.params && config.params.filterToken) {
      delete config.params.filterToken;
      delete config.headers["Authorization"];
    }
  }
  return config;
});

axios.interceptors.response.use(
  function(response) {
    let {
      config: { url, method, data }
    } = response;
    let filterUrl = [
      "/testdownload/AllList",
    ];
    if (filterUrl.includes(url)) {
      return response;
    }
    
    return response.data;
  },
  function(error) {
    if (global.vm.$toastLoading) {
      global.vm.$toastLoading.close();
    }
    if (error.message && error.message == "Network Error") {
      global.vm.$message.error("网络链接异常,请检查您的网络");
    }
    if (error.response.status === 401) {
      //  登录失效操作
      global.vm.$message.error("登录失效，请重新登录");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else if (error.response.status === 403) {
      global.vm.$message.error("您未开通权限，请联系管理员开通权限");
      // setTimeout(() => {
      //   window.location.href = '/';
      // }, 1000);
    } else if (error.response.status === 500) {
      if (error.response.data.code === 7111) {
        localStorage.removeItem("ACCESS_TOKEN");
        global.vm.$message.error("登录失效，请重新登录");
        //  登录失效操作
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        global.vm.$message.error("服务器异常，请稍后再试");
      }
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
