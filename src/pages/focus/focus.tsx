/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-12-23 11:42:26
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-29 10:56:06
 */
import React from "react";
import Timer from "@/components/focus/Timer";
import Overview from "@/components/focus/Overview";
import Record from "@/components/focus/Record";
import { Splitter, Typography } from "antd";
const Focus: React.FC = () => {
  const { Title, Text } = Typography;
  const mediaQuery = window.matchMedia("(min-width:499px)");
  const [tabletQuery, setTabletQuery] = React.useState<boolean>(
    mediaQuery.matches
  );
  console.log(tabletQuery);
  React.useEffect(() => {
    const listener = () => setTabletQuery(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
  return (
    <div className="flex flex-row h-screen bg-white select-none">
      {tabletQuery ? (
        <Splitter className="w-full h-full">
          <Splitter.Panel defaultSize="40%" min="35%">
            <div className="">
              <div className="p-5 text-left">
                <Title level={4}>番茄专注</Title>
              </div>
              <div className="items-center justify-center mt-auto">
                <Timer initialTime={1500} />
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
            <div className="p-5 text-left">
              <Title level={4}>番茄专注</Title>
            </div>
            <div className="flex items-center justify-center flex-grow  will-change-transform">
              <Timer initialTime={1500} />
            </div>
          </div>
        </>
      )}
      {/* 左侧番茄时钟 */}
    </div>
  );
};

export default Focus;
