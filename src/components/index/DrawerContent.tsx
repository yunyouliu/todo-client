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
import { SidebarItem } from "@/models/sidebar"; // 定义类型
import UserPopover from "./UserPopover";

interface DrawerContentProps {
  avatarSrc: string;
  sidebarData: SidebarItem[];
  buttomIcons: SidebarItem[];
  activeKey: string;
  onItemClick: (key: string, label: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
  avatarSrc,
  sidebarData,
  buttomIcons,
  activeKey,
  onItemClick,
}) => {
  const [Flag, setFlag] = React.useState(false);
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-6 fixed bg-white w-[75%] z-20">
        <div className="flex items-center gap-2">
          <UserPopover avatar={avatarSrc} size={40} />
        </div>
      </div>
      <div className="flex gap-3 translate-y-6 items-center bg-white absolute right-5 z-20">
        <SyncOutlined
          onClick={() => {
            setFlag(true);
            setTimeout(() => setFlag(false), 2000);
          }}
          spin={Flag}
          style={{ fontSize: "24px" }}
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
        />
      </div>
    </>
  );
};

export default DrawerContent;
