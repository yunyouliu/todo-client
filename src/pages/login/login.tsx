import React, { useState, useMemo, useCallback } from "react";
import { Form, Input, Button, Typography, Space, Checkbox } from "antd";
import { WechatOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const { Title, Link, Text } = Typography;

const Index = () => {
  const [formType, setFormType] = useState("login"); // 表单类型：login, register, forgetPassword

  // 切换表单类型的公共函数
  const toggleFormType = useCallback(
    (type: "login" | "register") => {
      if (formType !== type) {
        setFormType(type);
      }
    },
    [formType]
  );

  // 只在 formType 发生变化时更新 formType
  const handleFormTypeChange = (type: string) => {
    if (formType !== type) {
      setFormType(type);
    }
  };

  // 缓存按钮文本
  const buttonText = useMemo(
    () => (formType === "login" ? "注册" : "登录"),
    [formType]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Logo and Register Link */}
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <Title
          level={3}
          style={{ color: "#1677ff" }}
          className="tablet:text-sm text-base"
        >
          滴答清单
        </Title>
      </div>

      {formType !== "forgetPassword" && (
        <>
          <div className="absolute top-8 right-12 tablet:block hidden">
            <a className="text-gray-500 text-[12px]">
              {formType === "login" ? "还没有账号？" : "已有账号？"}
            </a>
            <Button
              type="primary"
              size="middle"
              onClick={() =>
                toggleFormType(formType === "login" ? "register" : "login")
              }
            >
              {buttonText}
            </Button>
          </div>
          <div className="absolute top-10 right-12 tablet:hidden">
            <a
              className="text-blue-400"
              onClick={() =>
                toggleFormType(formType === "login" ? "register" : "login")
              }
            >
              {buttonText}
            </a>
          </div>
        </>
      )}

      {/* Form Section */}
      <div className="w-[390px] h-[447px] max-w-md tablet:bg-white px-12 py-8 rounded-2xl tablet:shadow-lg">
        <Title level={3} className="text-left mt-4">
          {formType === "login"
            ? "登录"
            : formType === "register"
              ? "注册"
              : "重置密码"}
        </Title>
        <Form
          layout="vertical"
          onFinish={(values) => console.log(`${formType}成功：`, values)}
          className="mt-6"
        >
          {formType === "login" && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入手机号或邮箱" }]}
              >
                <Input placeholder="手机号/邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password placeholder="密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="h-9">
                  登录
                </Button>
              </Form.Item>
            </>
          )}

          {formType === "register" && (
            <>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "请输入邮箱" }]}
              >
                <Input placeholder="手机号/邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password placeholder="密码：6-64字符" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="h-9">
                  注册
                </Button>
              </Form.Item>
            </>
          )}

          {formType === "forgetPassword" && (
            <>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "请输入邮箱" }]}
              >
                <Input placeholder="手机号/邮箱" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="h-9">
                  重置密码
                </Button>
              </Form.Item>
              <div className="text-center text-gray-400 text-[12px] space-x-2 -mt-2">
                <a
                  className="mr-2"
                  onClick={() => handleFormTypeChange("login")}
                >
                  返回登录
                </a>
                |<a onClick={() => handleFormTypeChange("register")}>注册</a>
              </div>
            </>
          )}
        </Form>

        {formType !== "forgetPassword" && (
          <div className="text-center h-16 -mt-2">
            {formType === "login" ? (
              <div
                onClick={() => handleFormTypeChange("forgetPassword")}
                className="text-[13px] text-gray-400  hover:underline cursor-pointer"
              >
                忘记密码
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[12px] space-x-2">
                  <Checkbox />
                  <span className="text-[13px] text-gray-400">
                    同意
                    <a
                      className="underline cursor-pointer"
                      href="https://dida365.com/tos"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      使用条款
                    </a>
                    和
                    <a
                      className="underline cursor-pointer"
                      rel="noopener noreferrer"
                      href="https://dida365.com/privacy"
                      target="_blank"
                    >
                      隐私政策
                    </a>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {formType !== "forgetPassword" && (
          <Space direction="vertical" size="middle" className="w-full mt-2">
            <Button
              icon={<WechatOutlined style={{ fontSize: "20px" }} />}
              style={{ backgroundColor: "#52c41a", color: "#fff" }}
              className="h-9"
              block
            >
              微信
            </Button>
            <div className="text-center">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                更多登录方式
              </Text>
            </div>
          </Space>
        )}
      </div>

      {formType !== "forgetPassword" && (
        <div className="absolute bottom-24 hidden text-[12px] tablet:flex items-center space-x-1">
          <Text type="secondary" className="text-[12px]">
            {formType === "login" ? "还没有账号？" : "已有账号？"}
          </Text>
          <a
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              toggleFormType(formType === "login" ? "register" : "login");
            }}
          >
            {buttonText}
          </a>
        </div>
      )}
    </div>
  );
};

export default React.memo(Index);
