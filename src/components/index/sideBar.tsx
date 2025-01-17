/*
 * @Descripttion: 侧边栏组件
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-21 15:33:30
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-17 10:58:53
 */

import React, { useState } from "react";
import { Avatar, Tooltip, Popover, Badge } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "@/components/index/icon"; // 自定义图标组件的路径
import { useNavigate, useDispatch, useSelector } from "umi";
import MenuItem from "@/components/task/common/MenuItem";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [Flag, setFlag] = useState<boolean>(false);
  const naviugate = useNavigate();
  const handleMenuItemClick = (index: number, path: string) => {
    setActiveIndex(index); // 设置当前激活的菜单索引
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
      <Popover
        placement="rightTop"
        trigger="click"
        arrow={false}
        overlayInnerStyle={{ padding: 0 }}
        content={
          <div className="w-40 p-1 shadow-lg">
            <MenuItem
              icon="shezhi"
              label="设置"
              size={20}
              onClick={() => {
                console.log("点击了通知");
              }}
            />
            <MenuItem
              icon="tongji"
              label="统计"
              size={17}
              onClick={() => {
                console.log("点击了通知");
              }}
            />

            <MenuItem
              icon="vip"
              label="高级会员"
              size={18}
              onClick={() => {
                console.log("点击了通知");
              }}
            />
            <MenuItem
              icon="logout"
              label="退出登陆"
              size={20}
              onClick={() => {
                console.log("点击了通知");
              }}
            />
          </div>
        }
      >
        <Badge count={<Icon name="vip" />}>
          <Avatar
            src={avatarSrc}
            size={36}
            shape="square"
            className="mb-4 cursor-pointer"
          />
        </Badge>
      </Popover>

      {/* 菜单图标 */}
      <ul className="flex-1 flex flex-col items-center gap-4">
        {menuItems.map((item, index) => (
          <Tooltip
            title={item.label}
            placement="right"
            key={index}
            trigger={["hover"]}
          >
            <li
              key={index}
              className={`w-8 h-8 flex justify-center items-center cursor-pointer rounded-full`}
              onClick={(e) => {
                handleMenuItemClick(index, item.path);
              }}
            >
              <Icon
                name={activeIndex === index ? item.activeIcon : item.icon}
                size={25}
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
            <Icon name="tongzhi1" className="cursor-pointer" size={35} />
          </>
        </Tooltip>
        <Tooltip title="更多" placement="right" key="more">
          <>
            <Icon name="yiwen" className="cursor-pointer" size={28} />
          </>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
