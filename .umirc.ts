/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 17:50:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-23 11:44:16
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
      redirect: "/singin",
      layout: false,
    },
    {
      path: "/singin",
      component: "@/pages/login/login",
      layout: false,
    },
    {
      path: "/task",
      component: "@/pages/task/task",
    },
    {
      path:"/matrix",
      component:"@/pages/quadrantPage/QuadrantPage"
    },{
      path:"/calendar",
      component:"@/pages/calendar/CalendarPage"
    },{
      path:"/focus",
      component:"@/pages/focus/focus"
    }
  ],
});
