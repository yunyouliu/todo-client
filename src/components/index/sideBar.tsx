/*
 * @Descripttion: 侧边栏组件
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-21 15:33:30
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-22 17:24:05
 */

import React, { useState } from "react";
import { Avatar, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "@/components/index/icon"; // 自定义图标组件的路径

interface MenuItem {
  icon: string; // 图标名称
  activeIcon: string; // 激活时的图标名称
  label: string; // 菜单标题
  onClick?: () => void; // 点击事件
}

interface SidebarProps {
  menuItems: MenuItem[]; // 菜单配置项
  avatarSrc: string; // 头像链接
  onAvatarClick?: () => void; // 头像点击事件
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  avatarSrc,
  onAvatarClick,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [Flag, setFlag] = useState<boolean>(false);
  const handleMenuItemClick = (index: number, onClick?: () => void) => {
    setActiveIndex(index); // 设置当前激活的菜单索引
    if (onClick) onClick(); // 触发菜单项的点击事件
  };

  return (
    <div className="bg-white h-full shadow-md w-12 flex flex-col items-center pt-4">
      {/* 用户头像 */}
      <Avatar
        src={avatarSrc}
        size={36}
        shape="square"
        className="mb-4 cursor-pointer"
        onClick={onAvatarClick}
      />

      {/* 菜单图标 */}
      <ul className="flex-1 flex flex-col items-center gap-4">
        {menuItems.map((item, index) => (
          <Tooltip title={item.label} placement="right" key={index}>
            <li
              key={index}
              className={`w-8 h-8 flex justify-center items-center cursor-pointer rounded-full`}
              onClick={(e) => {
                handleMenuItemClick(index, item.onClick);
              }}
            >
              <Icon
                name={activeIndex === index ? item.activeIcon : item.icon}
                className="w-6 h-6"
              />
            </li>
          </Tooltip>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-5 mb-4">
        {/* 底部刷新图标 */}
        <Tooltip title="同步" placement="right" key="refresh">
          <SyncOutlined
            onClick={() => {
              setFlag(!Flag);
            }}
            spin={Flag}
            style={{ fontSize: "24px" }}
            className="text-gray-400 text-lg  cursor-pointer"
          />
        </Tooltip>
        <Tooltip title="通知" placement="right" key="info">
          <>
            <Icon name="tongzhi" className="w-6 h-6 cursor-pointer" />
          </>
        </Tooltip>
        <Tooltip title="更多" placement="right" key="more">
          <>
            <Icon name="bangzhu" className="w-6 h-6 cursor-pointer" />
          </>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
