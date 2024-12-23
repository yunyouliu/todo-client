/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 17:50:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-22 21:01:27
 */
import React from "react";
import "../../global.css";
import "../assets/iconfont";
import { Layout, theme ,ConfigProvider} from "antd";
import Sidebar from "@/components/index/sideBar";
import { Outlet } from "umi";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const { Sider, Content } = Layout;

interface MenuItem {
  icon: string;
  activeIcon: string;
  label: string;
  onClick?: () => void;
}

const Layouts: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems: MenuItem[] = [
    {
      icon: "renwu",
      activeIcon: "renwu-copy",
      label: "任务",
      onClick: () => console.log("任务"),
    },
    {
      icon: "rilishitu",
      activeIcon: "rilishitu-copy",
      label: "日程",
      onClick: () => console.log("日程"),
    },
    {
      icon: "dibutubiao-sixiangxian",
      activeIcon: "dibutubiao-sixiangxian-copy",
      label: "设置",
      onClick: () => console.log("设置"),
    },
    {
      icon: "zhuanzhumoshi",
      activeIcon: "zhuanzhumoshi-copy",
      label: "专注",
      onClick: () => console.log("专注"),
    },
    {
      icon: "daka-copy",
      activeIcon: "daka",
      label: "打卡",
      onClick: () => console.log("打卡"),
    },
    {
      icon: "ss",
      activeIcon: "ss-copy",
      label: "搜索",
      onClick: () => console.log("搜索"),
    },
  ];

  const avatarSrc =
    "https://profile-photo.s3.cn-north-1.amazonaws.com.cn/files/avatar/51270/MTAyNTQxMzgxNTFlc2Q2dmFx/avatar.png?v=ab117780915717552c6df1b7c243c26b";

  return (
    <ConfigProvider locale={zhCN}>
    <div className="h-full">
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
