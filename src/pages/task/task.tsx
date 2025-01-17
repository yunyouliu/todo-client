import React, { useState } from "react";
import { Splitter } from "antd";
import Sidebar from "@/components/task/common/Sidebar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useSelector, useDispatch } from "umi";
import useMediaQuery from "@/hooks/useMediaQuery";

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
  const dispatch = useDispatch();
  const { activeKey, activeLabel, isopen, isCollapsed } = useSelector(
    (state: any) => state.active
  );
  const navigate = useNavigate();
  const isTablet = useMediaQuery("(min-width: 499px)");
  const isSmallScreen = useMediaQuery("(max-width: 952px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 632px)");

  const handleItemClick = (key: string, lable: string) => {
    dispatch({
      type: "active/setActiveKey",
      payload: key,
    });
    dispatch({
      type: "active/setActiveLabel",
      payload: lable,
    });
    console.log(`Clicked on: ${key}`);
  };
  // React.useEffect(() => {
  //   if (isVerySmallScreen) {
  //     dispatch({ type: "active/setIsCollapsed", payload: true }); // 自动折叠侧边栏
  //   } else {
  //     dispatch({ type: "active/setIsCollapsed", payload: false }); // 恢复展开
  //   }
  // }, [isVerySmallScreen, dispatch]);

  return (
    <div className="h-full bg-white">
      {isTablet ? (
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
              onItemClick={(key, label) => handleItemClick(key, label)}
              onDragEnd={(result) => console.log("Drag ended", result)}
            />
          </Splitter.Panel>

          <Splitter.Panel min="26%">
            <div className="flex items-center p-3">
              {isCollapsed ? (
                <MenuUnfoldOutlined
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => dispatch({ type: "active/toggleIsCollapsed" })}
                />
              ) : (
                <MenuFoldOutlined
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => dispatch({ type: "active/toggleIsCollapsed" })}
                />
              )}
              <h2 className="ml-2 text-lg font-semibold mt-2">{activeLabel}</h2>
            </div>

            <div className="">
              <Outlet />
            </div>
          </Splitter.Panel>

          {!isSmallScreen && !isVerySmallScreen && (
            <Splitter.Panel min="20%">3</Splitter.Panel>
          )}
        </Splitter>
      ) : (
        <div>
          <div className="flex items-center p-3">
            {isopen ? (
              <MenuUnfoldOutlined
                className="text-lg cursor-pointer text-gray-500"
                onClick={() => dispatch({ type: "active/toggleIsOpen" })}
              />
            ) : (
              <MenuFoldOutlined
                className="text-lg cursor-pointer text-gray-500"
                onClick={() => dispatch({ type: "active/toggleIsOpen" })}
              />
            )}
            <h2 className="ml-2 text-lg font-semibold mt-2">{activeLabel}</h2>
          </div>

          <div className="">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
