/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-03 16:16:32
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-06 18:12:44
 */
import request from "@/utils/request";

// 定义接口类型
interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface RegisterParams {
  username: string;
  password: string;
  captcha?: string;
}

interface ResetPasswordParams {
  email: string;
  password: string;
  captcha: string;
}
export const login = (data: LoginParams) => {
  return request<LoginResponse>({
    url: "/users/login/local",
    method: "POST",
    data,
  });
};

export const getUserInfo = (data: { id: string }) => {
  return request({
    url: "/users/info",
    method: "GET",
  });
};

export const getAvatar = () => {
  return request({
    url: "/users/avatar",
    method: "GET",
  });
};

//register
export const register = (data: RegisterParams) => {
  return request({
    url: "/users/register",
    method: "POST",
    data,
  });
};

//reset password
export const resetPassword = (data: ResetPasswordParams) => {
  return request({
    url: "/users/reset-password",
    method: "POST",
    data,
  });
};
