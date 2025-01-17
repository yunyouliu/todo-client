/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-12-23 11:42:26
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-16 19:39:39
 */
import React from "react";
import Timer from "@/components/focus/Timer";
import Overview from "@/components/focus/Overview";
import Record from "@/components/focus/Record";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Splitter, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
const Focus: React.FC = () => {
  const { Title, Text } = Typography;
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
  const [activeKey, setActiveKey] = React.useState<string>("tomorrow");
  const isTablet = useMediaQuery("(min-width: 499px)");

  return (
    <div className="flex flex-row h-screen bg-white select-none">
      {isTablet ? (
        <Splitter className="w-full h-full">
          <Splitter.Panel defaultSize="40%" min="35%">
            <div className="">
              <div className="p-5 text-left">
                <Title level={4}>番茄专注</Title>
              </div>
              <div className="items-center justify-center mt-auto">
                <Timer initialTime={10} />
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel min="23%" defaultSize="28%">
            {/* 右侧专注概览与记录 */}
            <div className="p-3 text-left">
              <Overview />
              <Text className="text-lg mt-8">专注记录</Text>
              <Record />
            </div>
          </Splitter.Panel>
        </Splitter>
      ) : (
        <>
          <div className="items-center justify-center w-full h-full">
            <div className="p-5 text-left flex">
              {isCollapsed ? (
                <MenuUnfoldOutlined
                  className="text-xl cursor-pointer text-gray-500"
                  onClick={() => setIsCollapsed(false)}
                />
              ) : (
                <MenuFoldOutlined
                  className="text-xl cursor-pointer text-gray-500"
                  onClick={() => setIsCollapsed(true)}
                />
              )}
              <Title level={4} className="align-middle mt-1 ml-2">
                番茄专注
              </Title>
            </div>
            <div className="flex items-center justify-center flex-grow  will-change-transform">
              <Timer initialTime={10} />
            </div>
          </div>
        </>
      )}
      {/* 左侧番茄时钟 */}
    </div>
  );
};

export default Focus;
