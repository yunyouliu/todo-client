/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-03 16:06:22
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-06 18:12:18
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 定义基础配置
const service: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里加上token等全局参数
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 这里根据实际情况调整，比如后端成功和失败的标识字段
    const res = response.data;
    if (res.code !== 200) {
      // 统一错误提示处理
      console.error(res.message || "请求失败");
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  (error: any) => {
    console.error(error.message);
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const res = await service.request(config);
  return res.data;
};

export default request;
