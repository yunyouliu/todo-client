/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-27 20:31:49
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-15 22:10:13
 */
import React, { useState } from "react";
import { Splitter } from "antd";
import Sidebar from "@/components/task/common/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "umi";

interface SidebarItem {
  key: string;
  icon: string;
  size: number;
  label: string;
  count?: number;
}

const sidebarData: SidebarItem[] = [
  {
    key: "all",
    size: 18,
    icon: "suoyou",
    label: "所有",
    count: 11,
  },
  {
    key: "today",
    icon: `day${new Date().getDate()}`, // 动态生成图标名称
    label: "今天",
    size: 18,
    count: 1,
  },
  {
    key: "tomorrow",
    icon: "mingtian",
    label: "明天",
    size: 18,
  },
  {
    key: "week",
    icon: `icons-${new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()}`, // 动态生成图标名称
    label: "最近7天",
    size: 22,
    count: 1,
  },
  {
    key: "assigned",
    icon: "zhipai",
    label: "指派给我",
    size: 18,
  },
  {
    key: "inbox",
    icon: "shoujixiang",
    label: "收集箱",
    size: 18,
  },
  {
    key: "summary",
    icon: "zhaiyao",
    label: "摘要",
    size: 18,
  },
];

const buttomIcons: SidebarItem[] = [
  { key: "1", icon: "renwu", size: 18, label: "已完成" },
  { key: "2", icon: "fangqi", size: 20, label: "已放弃" },
  { key: "3", icon: "lajitong", size: 18, label: "垃圾桶" },
];

const Task: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("tomorrow");
  const [activeLabel, setActiveLabel] = useState<string>("明天");
  const navigate = useNavigate();

  const handleItemClick = (
    key: string,
    lable: string,
    setActiveKey: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setActiveKey(key);
    setActiveLabel(lable);
    // navigate(`/task/${key}`);
    console.log(`Clicked on: ${key}`);
  };
  return (
    <div className="h-full">
      <Splitter className="h-full shadow-sm bg-white">
        <Splitter.Panel
          min="14%"
          defaultSize={"24%"}
          className={`${isCollapsed ? "hidden" : ""}`}
          resizable={!isCollapsed}
        >
          <Sidebar
            data={sidebarData}
            bottomIcons={buttomIcons}
            activeKey={activeKey}
            onItemClick={(key, label) =>
              handleItemClick(key, label, setActiveKey)
            }
            onDragEnd={(result) => console.log("Drag ended", result)}
          />
        </Splitter.Panel>

        <Splitter.Panel min="26%">
          <div className="flex items-center p-3">
            {isCollapsed ? (
              <MenuUnfoldOutlined
                className="text-xl cursor-pointer text-gray-500"
                onClick={() => setIsCollapsed(false)}
              />
            ) : (
              <MenuFoldOutlined
                className="text-lg cursor-pointer text-gray-500"
                onClick={() => setIsCollapsed(true)}
              />
            )}
            <h2 className="ml-2 text-lg font-semibold mt-2">{activeLabel}</h2>
          </div>

          <div className="">
            <Outlet />
          </div>
        </Splitter.Panel>
        <Splitter.Panel min="20%">3</Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default Task;
