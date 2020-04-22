import axios from "axios";
import { Message } from 'element-ui';
import { getToken, getUsername } from "../utils/app"
//创建axios，赋给变量service
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/api'
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000
});

// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    //后台需要前端栓的参数，在请求头添加参数
    // Do something before request is sent

    //最终目的是在请求头添加参数
    config.headers['Tokey'] = getToken()
    config.headers['UserName'] = getUsername()
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    //对响应数据的操作
    let data = response.data;
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
    }







    // Do something with response data

  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default service;