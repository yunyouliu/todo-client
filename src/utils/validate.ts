/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-03 17:23:07
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-03 17:23:16
 */
// src/utils/validate.ts
export const validateAccount = (rule: any, value: string) => {
    if (!value) return Promise.reject('请输入手机号或邮箱');
    
    // 邮箱验证
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    // 手机号验证（简单版）
    const phoneRegex = /^1[3-9]\d{9}$/;
    
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('请输入有效的手机号或邮箱');
  };
  
  // 密码强度验证（至少6位，包含字母和数字）
  export const validatePassword = (rule: any, value: string) => {
    if (!value) return Promise.reject('请输入密码');
    if (value.length < 6) return Promise.reject('密码至少6位');
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return Promise.reject('需包含字母和数字');
    }
    return Promise.resolve();
  };