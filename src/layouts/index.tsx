/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 17:50:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-17 10:53:38
 */
import React, { useEffect, useState } from "react";
import "../../global.css";
import "../assets/iconfont";
import { Layout, theme, ConfigProvider, Drawer } from "antd";
import Sidebar from "@/components/index/sideBar";
import SideBar from "@/components/task/common/Sidebar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useDispatch, useSelector, Outlet } from "umi";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const { Sider, Content } = Layout;

// 菜单项
interface MenuItem {
  icon: string;
  activeIcon: string;
  label: string;
  path: string;
}
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
const Layouts: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const { activeKey, isopen } = useSelector((state: any) => state.active);
  const isTablet = useMediaQuery("(min-width: 499px)");
  useEffect(() => {
    if (isopen && isTablet) {
      dispatch({
        type: "active/setIsOpen",
        payload: !isTablet,
      });
    }
  }, [isopen, isTablet]);

  const handleItemClick = (key: string, lable: string) => {
    dispatch({
      type: "active/setActiveKey",
      payload: key,
    });
    dispatch({
      type: "active/setActiveLabel",
      payload: lable,
    });

    // navigate(`/task/${key}`);
    console.log(`Clicked on: ${key}`);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "renwu",
      activeIcon: "renwu-copy",
      label: "任务",
      path: "/task",
    },
    {
      icon: "rilishitu",
      activeIcon: "rilishitu-copy",
      label: "日历视图",
      path: "/calendar",
    },
    {
      icon: "dibutubiao-sixiangxian",
      activeIcon: "dibutubiao-sixiangxian-copy",
      label: "四象限",
      path: "/matrix",
    },
    {
      icon: "zhuanzhumoshi",
      activeIcon: "zhuanzhumoshi-copy",
      label: "番茄专注",
      path: "/focus",
    },
    {
      icon: "daka-copy",
      activeIcon: "daka",
      label: "习惯打卡",
      path: "/habit",
    },
    {
      icon: "ss",
      activeIcon: "ss-copy",
      label: "搜索",
      path: "/search",
    },
  ];

  const avatarSrc =
    "https://profile-photo.s3.cn-north-1.amazonaws.com.cn/files/avatar/51270/MTAyNTQxMzgxNTFlc2Q2dmFx/avatar.png?v=ab117780915717552c6df1b7c243c26b";

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          paddingLG: 0,
        },
      }}
    >
      <div className="h-full">
        <Drawer
          placement="left"
          width="76%"
          onClose={() => dispatch({ type: "active/toggleIsOpen" })}
          open={isopen}
          closeIcon={null}
        >
          <SideBar
            data={sidebarData}
            bottomIcons={buttomIcons}
            activeKey={activeKey}
            onItemClick={(key, label) => handleItemClick(key, label)}
            onDragEnd={(result) => console.log("Drag ended", result)}
          />
        </Drawer>
        <Layout className="h-full">
          <Sider
            trigger={null}
            width={48}
            theme="light"
            className="hidden tablet:flex"
          >
            <Sidebar menuItems={menuItems} avatarSrc={avatarSrc} />
          </Sider>
          <Layout>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default Layouts;
