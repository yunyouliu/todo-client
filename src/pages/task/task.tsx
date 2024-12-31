import React, { useState } from "react";
import { Splitter, Divider, Collapse } from "antd";
import Icon from "@/components/index/icon";
import Sidebar from "@/components/task/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

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

const handleItemClick = (
  key: string,
  setActiveKey: React.Dispatch<React.SetStateAction<string>>
) => {
  setActiveKey(key);
  console.log(`Clicked on: ${key}`);
};

const Task: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("all");

  return (
    <div className="h-full">
      <Splitter className="h-full shadow-sm bg-white">
        <Splitter.Panel
          min="14%"
          defaultSize={"24%"}
          className={`${isCollapsed ? "hidden" : ""}`}
        >
          <Sidebar
            data={sidebarData}
            activeKey={activeKey}
            onItemClick={(key) => handleItemClick(key, setActiveKey)}
          />
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
            <h2 className="ml-2 text-lg font-semibold mt-2">所有</h2>
          </div>

          <div className="p-4">
            <p>这里是主任务展示区域，可以动态加载内容。</p>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min="20%">3</Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default Task;
