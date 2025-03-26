/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 17:50:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-23 23:47:49
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
  proxy: {
    "/api": {
      // 代理的前缀
      target: "http://localhost:3000/api", // 后端服务器地址
      changeOrigin: true, // 是否跨域
      pathRewrite: { "^/api": "" }, // 重写路径（可选）
    },
      '/ws': {
        target: 'ws://localhost:3000', // WebSocket 服务器地址
        ws: true, // 开启 WebSocket 代理
        changeOrigin: true,
      },
  },
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
      routes: [
        {
          path: "/task/all/*",
          component: "@/pages/task/all",
          exart:false
        },
        {
          path: "/task/assignedme/",
          component: "@/pages/task/assignedme",
        },
        {
          path: "/task/assignedme/:id",
          component: "@/pages/task/assignedme",
        },
        {
          path: "/task/today/",
          component: "@/pages/task/today",
        },
        {
          path: "/task/today/:id",
          component: "@/pages/task/today",
        },
        {
          path: "/task/tomorrow/",
          component: "@/pages/task/tomorrow",
        },
        {
          path: "/task/tomorrow/:id",
          component: "@/pages/task/tomorrow",
        },
        {
          path: "/task/abstract/",
          component: "@/pages/task/abstract",
        },
        {
          path: "/task/week/",
          component: "@/pages/task/week",
        },
        {
          path: "/task/week/:id",
          component: "@/pages/task/week",
        },
        {
          path: "/task/inbox/",
          component: "@/pages/task/inbox",
        },
        {
          path: "/task/inbox/:id",
          component: "@/pages/task/inbox",
        },
        {
          path: "/task/abandoned/",
          component: "@/pages/task/abandoned",
        },
        {
          path: "/task/abandoned/:id",
          component: "@/pages/task/abandoned",
        },
        {
          path: "/task/completed/",
          component: "@/pages/task/completed",
        },
        {
          path: "/task/completed/:id",
          component: "@/pages/task/completed",
        },
        {
          path: "/task/trash/",
          component: "@/pages/task/trash",
        },
        {
          path: "/task/trash/:id",
          component: "@/pages/task/trash",
        },
      ],
    },
    {
      path: "/matrix",
      component: "@/pages/quadrantPage/QuadrantPage",
    },
    {
      path: "/calendar",
      component: "@/pages/calendar/CalendarPage",
    },
    {
      path: "/focus",
      component: "@/pages/focus/focus",
    },
    {
      path: "/habit",
      component: "@/pages/habit/habit",
    },
  ],
});
