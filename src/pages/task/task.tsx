/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-27 20:31:49
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-07 10:29:48
 */
import React, { useState } from "react";
import { Splitter, Divider, Collapse } from "antd";
import Icon from "@/components/index/icon";
import Sidebar from "@/components/task/common/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "umi";

interface SidebarItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

const sidebarData: SidebarItem[] = [
  {
    key: "all",
    icon: <Icon name="suoyou" size={20} />,
    label: "所有",
    count: 11,
  },
  {
    key: "today",
    icon: <Icon name={`day${new Date().getDate()}`} size={20} />,
    label: "今天",
    count: 1,
  },
  {
    key: "tomorrow",
    icon: <Icon name="mingtian" size={20} />,
    label: "明天",
  },
  {
    key: "week",
    icon: (
      <Icon
        name={`icons-${new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()}`}
        size={22}
      />
    ),
    label: "最近7天",
    count: 1,
  },
  {
    key: "assigned",
    icon: <Icon name="zhipai" size={20} />,
    label: "指派给我",
  },
  {
    key: "inbox",
    icon: <Icon name="shoujixiang" size={20} />,
    label: "收集箱",
  },
  {
    key: "summary",
    icon: <Icon name="zhaiyao" size={20} />,
    label: "摘要",
  },
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
    navigate(`/task/${key}`);
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
            activeKey={activeKey}
            onItemClick={(key, label) =>
              handleItemClick(key, label, setActiveKey)
            }
            onDragEnd={(result) => console.log("Drag ended", result)}
          />

          <Divider />
          <a href="mailto:john.doe@example.com?subject=Meeting%20Reminder&body=Hi%20John,%0D%0ADon't%20forget%20about%20our%20meeting%20tomorrow%20at%2010%20AM.%0D%0AThanks!&cc=jane.doe@example.com&bcc=manager@example.com">
            打开 Outlook 邮件
          </a>
          <Divider />
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
