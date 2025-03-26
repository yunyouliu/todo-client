import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Checkbox,
  message,
} from "antd";
import {
  WechatOutlined,
  GithubOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { useNavigate, useDispatch } from "umi";
import { userApi, taskApi } from "@/api";
import { TaskOperations } from "@/lib/db/taskOperations";
import { ITask, db } from "@/lib/db/database";
import { WebSocketManager } from "@/lib/ws/WebSocketManager";
import EventHandlers from "@/lib/ws/eventHandlers";
const { Title, Text } = Typography;

const Index = () => {
  const [formType, setFormType] = useState<
    "login" | "register" | "forgetPassword"
  >("login");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 在组件顶部添加手机号验证正则
  const PHONE_REGEXP = /^1[3-9]\d{9}$/;
  const wsManager = WebSocketManager.getInstance("/ws");


  useEffect(() => {
    
  }, []);
  // 修改注册部分的表单验证规则
  const accountRules = [
    { required: true, message: "请输入手机号或邮箱" },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (
          !value ||
          PHONE_REGEXP.test(value) ||
          /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
        ) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("请输入有效的手机号或邮箱"));
      },
    }),
  ];

  const passwordRules = [
    { required: true, message: "请输入密码" },
    { min: 6, message: "密码至少6位" },
    { max: 64, message: "密码最多64位" },
  ];

  // 统一表单提交处理
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      switch (formType) {
        case "login":
          const user = await userApi.login({
            username: values.username,
            password: values.password,
          });
          dispatch({
            type: "user/login",
            payload: {
              id: (user as any).data.user._id,
              token: (user as any).data.token,
            },
          });

          const taskOperations = new TaskOperations(wsManager);
          // await taskOperations.syncTasksAfterLogin();
          message.success("登录成功");
          navigate("/task/all");
          break;

        case "register":
          const params = {
            username: values.username,
            password: values.password,
          };
          if (!agree) {
            message.error("请同意使用条款和隐私政策");
            return;
          }
          await userApi.register(params);
          message.success("注册成功，请登录");
          setFormType("login");
          break;

        case "forgetPassword":
          await userApi.resetPassword(values.email);
          message.success("重置密码邮件已发送，请检查邮箱");
          break;
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "操作失败");
    } finally {
      setLoading(false);
    }
  };

  // 第三方登录处理
  const handleSocialLogin = (provider: string) => {
    message.info(`正在前往${provider}...`);
    window.location.href = `http://localhost:3000/api/users/auth/${provider}`;
  };
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
  const handleFormTypeChange = (
    type: "login" | "register" | "forgetPassword"
  ) => {
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
          level={4}
          style={{ color: "#1677ff" }}
          className="tablet:text-sm text-base"
        >
          智能清单
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
          onFinish={handleSubmit}
          className="mt-6"
          // initialValues={{ remember: true }}
          initialValues={{
            username: "2876177342@qq.com",
            password: "123456",
          }}
        >
          {formType === "login" && (
            <>
              <Form.Item name="username" rules={accountRules}>
                <Input placeholder="手机号/邮箱" allowClear autoComplete="" />
              </Form.Item>

              <Form.Item name="password" rules={passwordRules}>
                <Input.Password
                  placeholder="密码"
                  allowClear
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="h-9"
                >
                  登录
                </Button>
              </Form.Item>
            </>
          )}

          {formType === "register" && (
            <>
              <Form.Item name="username" rules={accountRules}>
                <Input placeholder="手机号/邮箱" allowClear />
              </Form.Item>

              <Form.Item name="password" rules={passwordRules}>
                <Input.Password placeholder="密码：6-64字符" allowClear />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="h-9"
                >
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
                  <Checkbox checked={agree} onChange={() => setAgree(!agree)} />
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
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  其他登录方式
                </span>
              </div>
            </div>

            <Space className="w-full justify-center">
              <Button
                icon={<WechatOutlined style={{ fontSize: 20 }} />}
                shape="circle"
              />
              <Button
                icon={<GithubOutlined style={{ fontSize: 20 }} />}
                shape="circle"
                onClick={() => handleSocialLogin("github")}
              />
              <Button
                icon={<GoogleOutlined style={{ fontSize: 20 }} />}
                shape="circle"
                onClick={() => handleSocialLogin("google")}
              />
            </Space>
          </div>
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
