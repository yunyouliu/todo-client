/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-15 16:26:19
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-20 23:42:50
 */
import React from "react";
import Icon from "@/components/index/icon";
import { useLocation } from "umi";

interface SidebarItemProps {
  item: {
    size?: number;
    key: string;
    icon?: string;
    label: string;
    count?: number;
  };
  onClick: () => void;
  color?: string; // 可选属性，用来控制右侧圆点的颜色   //hex RGB
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  onClick,
  color, // 接收 color 属性
}) => {
  const location = useLocation();

  const isActive = location.pathname.match(item.key);
  return (
    <div
      className={`flex items-center p-2.5 text-sm cursor-pointer group  focus:outline-none  hover:bg-gray-100 rounded-lg ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
      key={item.key}
    >
      {item.icon && <Icon name={item.icon} size={item.size} />}
      <span className="ml-2 text-[#191919]">{item.label}</span>
      <div className="flex items-center ml-auto relative">
        {color && (
          <div
            className="w-2.5 h-2.5 rounded-full flex-none mr-2"
            style={{ backgroundColor: color }} // 使用 style 来设置背景色
          />
        )}
        <div className="w-[20px]  flex justify-end items-center">
          {item.count !== undefined && item.count > 0 && (
            <span className="text-gray-500 group-hover:hidden">
              {item.count}
            </span>
          )}
          <span className="hidden group-hover:flex text-gray-400 text-sm absolute items-center">
            <Icon name="more" size={12} className="hover:text-black" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarItem;
