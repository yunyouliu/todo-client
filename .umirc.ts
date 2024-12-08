/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 17:50:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-11-30 18:10:19
 */
import { defineConfig } from "umi";
export default defineConfig({
  npmClient: "pnpm",
  tailwindcss: {},
  antd: {},
  dva: {},
  fastRefresh: true,
  plugins: [
    "@umijs/plugins/dist/tailwindcss",
    "@umijs/plugins/dist/antd",
    "@umijs/plugins/dist/dva",
  ],
  proxy: {},
  mfsu: {},
  alias: {
    "@": "./src",
  },
  routes: [
    {
      path: "/",
      component: "@/pages/login/login",
      layout: false,
    },
    {
      path: "/home",
      component: "home",
    },
  ],
});
