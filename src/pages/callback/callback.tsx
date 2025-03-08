// src/pages/callback.tsx
import React, { useEffect } from "react";
import { history } from "umi";
import { setCookie } from "@/utils/cookie";

const CallbackPage: React.FC = () => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      // 设置 Cookie（有效7天，全站可用）
      setCookie("token", token, {
        expires: 7,
        path: "/",
        secure: true, // 仅在 HTTPS 下生效
      });

      // 重定向到任务页面
      history.push("/task");
    } else {
      history.push("/");
    }
  }, []);

  return <div>Loading...</div>;
};

export default CallbackPage;
