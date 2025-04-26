/*
 * @Descripttion: 侧边栏组件
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-21 15:33:30
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-20 23:24:55
 */

import React, { useState } from "react";
import { Avatar, Tooltip, Popover, Badge } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "@/components/index/icon"; // 自定义图标组件的路径
import { useNavigate, useLocation } from "umi";
import MenuItem from "@/components/task/common/MenuItem";
import UserPopover from "@/components/index/UserPopover";

interface MenuItem {
  icon: string; // 图标名称
  activeIcon: string; // 激活时的图标名称
  label: string; // 菜单标题
  path: string; // 菜单路径
}

interface SidebarProps {
  menuItems: MenuItem[]; // 菜单配置项
  avatarSrc: string; // 头像链接
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, avatarSrc }) => {
  const [Flag, setFlag] = useState<boolean>(false);
  const naviugate = useNavigate();
  const location = useLocation(); // 获取当前页面的路径，用来判断当前页面是否是激活状态
  const handleMenuItemClick = (index: number, path: string) => {
    // 触发菜单项的点击事件
    naviugate(path);
  };
  const handleAcatarClick = () => {
    // 触发头像的点击事件
    console.log("点击了头像");
  };

  return (
    <div className="bg-white h-full shadow-md w-12 flex flex-col items-center pt-4">
      {/* 用户头像 */}
      <UserPopover avatar={avatarSrc} size={40} vip />
      {/* 菜单图标 */}
      <ul className="flex-1 flex flex-col items-center gap-4">
        {menuItems.map((item, index) => (
          <Tooltip
            title={item.label}
            placement="right"
            key={index}
            trigger={["hover"]}
            arrow={false}
            mouseEnterDelay={0.3}
          >
            <li
              key={index}
              className={`w-8 h-8 flex justify-center items-center cursor-pointer rounded-full`}
              onClick={(e) => {
                handleMenuItemClick(index, item.path);
              }}
            >
              <Icon
                // 判断当前页面是否是激活状态，如果是则显示激活时的图标，否则显示默认图标
                name={
                  location.pathname.includes(item.path)
                    ? item.activeIcon
                    : item.icon
                }
                size={25}
              />
            </li>
          </Tooltip>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-5 mb-4">
        {/* 底部刷新图标 */}
        <Tooltip title="同步" placement="right" key="refresh" arrow={false}>
          <SyncOutlined
            onClick={() => {
              setFlag(true);
              setTimeout(() => setFlag(false), 2000);
            }}
            spin={Flag}
            style={{ fontSize: "24px" }}
            className="text-gray-400 text-lg cursor-pointer"
          />
        </Tooltip>
        <Tooltip title="通知" placement="right" key="info" arrow={false}>
          <>
            <Icon name="tongzhi1" className="cursor-pointer" size={35} />
          </>
        </Tooltip>
        <Tooltip title="更多" placement="right" key="more" arrow={false}>
          <>
            <Icon name="yiwen" className="cursor-pointer" size={28} />
          </>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
