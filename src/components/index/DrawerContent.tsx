/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-02-23 19:11:14
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-02-24 17:29:56
 */
import React from "react";
import { Avatar } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "@/components/index/icon";
import SideBar from "@/components/task/common/Sidebar";
import { SidebarItem } from "@/models/sidebar"// 定义类型

interface DrawerContentProps {
  avatarSrc: string;
  sidebarData: SidebarItem[];
  buttomIcons: SidebarItem[];
  activeKey: string;
  onItemClick: (key: string, label: string) => void;
  onDragEnd: (result: any) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
  avatarSrc,
  sidebarData,
  buttomIcons,
  activeKey,
  onItemClick,
  onDragEnd,
}) => {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-6 fixed bg-white w-[75%] z-20">
        <div className="flex items-center gap-2">
          <Avatar src={avatarSrc} size={34} shape="square" className="cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-3 translate-y-6 items-center bg-white absolute right-5 z-20">
        <SyncOutlined
          spin={false}
          style={{ fontSize: "20px" }}
          className="text-gray-400 text-lg cursor-pointer"
        />
        <Icon name="tongzhi1" className="cursor-pointer" size={30} />
        <Icon name="yiwen" className="cursor-pointer" size={23} />
      </div>
      <div className="mt-20">
        <SideBar
          data={sidebarData}
          bottomIcons={buttomIcons}
          activeKey={activeKey}
          onItemClick={onItemClick}
          onDragEnd={onDragEnd}
        />
      </div>
    </>
  );
};

export default DrawerContent;