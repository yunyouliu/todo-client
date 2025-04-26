// src/pages/error/404.tsx
import React from "react";
import { Row, Col } from "antd";
import gifUrl from "@/assets/404.gif";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white text-gray-800 p-4">
      <Row gutter={48} align="middle">
        {/* 左侧内容 */}
        <Col xs={24} md={12}>
          <h1 className="text-9xl font-bold text-slate-700">Oops!</h1>
          <h2 className="text-2xl mb-4">
            We can't seem to find the page you're looking for.
          </h2>
          <h6 className="text-lg text-gray-600">Error code: 404</h6>
          <h1 className="mt-8">Here are some helpful links instead:</h1>
          <ul className="list-none p-0">
            {[
              { href: "/", label: "Home" },
              { href: "/search", label: "Search" },
              { href: "/help", label: "Help" },
              { href: "/trust-safety", label: "Trust & Safety" },
              { href: "/sitemap", label: "Sitemap" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-blue-500 no-underline block mb-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Col>

        {/* 右侧图片 */}
        <Col xs={24} md={12} className="flex justify-center">
          <img
            src={gifUrl}
            alt="404 not found"
            className="max-w-full max-h-[400px] object-contain"
          />
        </Col>
      </Row>
    </div>
  );
};

export default NotFoundPage;
