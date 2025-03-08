/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-14 17:50:16
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-02-26 21:28:17
 */
import React, { useEffect } from "react";
import "../../global.css";
import "../assets/iconfont";
import { Layout, theme, ConfigProvider, Drawer } from "antd";
import Sidebar from "@/components/index/sideBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useDispatch, useSelector, Outlet, useLocation } from "umi";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DrawerContent from "@/components/index/DrawerContent";
import { SidebarItem } from "@/models/sidebar";
dayjs.locale("zh-cn");

const { Sider, Content } = Layout;

// 菜单项
interface MenuItem {
  icon: string;
  activeIcon: string;
  label: string;
  path: string;
}

const Layouts: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const location = useLocation();
  const { activeKey, isopen } = useSelector((state: any) => state.active);
  const { sidebarData, drawerButtomIcons,buttomIcons } = useSelector(
    (state: {
      sidebar: { sidebarData: SidebarItem[]; drawerButtomIcons: SidebarItem[],buttomIcons: SidebarItem[] };
    }) => state.sidebar
  );
  const isTablet = useMediaQuery("(min-width: 499px)");

  useEffect(() => {
    if (isTablet && isopen) {
      dispatch({
        type: "active/setIsOpen",
        payload: false, // 在桌面端自动关闭抽屉
      });
    }
  }, [isTablet, isopen, dispatch]);


  useEffect(() => {
    // 直接用 pathname 匹配 sidebarData 和 buttomIcons
    const activeItem = [...sidebarData, ...buttomIcons].find(item =>
      location.pathname.startsWith(item.key)
    );
    dispatch({
      type: "active/setActiveLabel",
      payload: activeItem?.label || "",
    });
    console.log("activeItem", activeItem?.label);
  }, [location.pathname, sidebarData, buttomIcons]);


  const handleItemClick = (key: string, lable: string) => {
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
          <DrawerContent
            avatarSrc={avatarSrc}
            sidebarData={sidebarData}
            buttomIcons={drawerButtomIcons}
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
