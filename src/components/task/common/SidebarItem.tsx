/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-15 16:26:19
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-16 19:09:46
 */
import React from "react";
import Icon from "@/components/index/icon";

interface SidebarItemProps {
  item: {
    size?: number;
    key: string;
    icon?: string;
    label: string;
    count?: number;
  };
  isActive: boolean;
  onClick: () => void;
  color?: string; // 可选属性，用来控制右侧圆点的颜色   //hex RGB
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  onClick,
  color, // 接收 color 属性
}) => (
  <div
    className={`flex items-center p-2.5 text-sm cursor-pointer group focus:outline-none hover:cursor-auto hover:bg-gray-100 rounded-lg ${
      isActive ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    {item.icon && <Icon name={item.icon} size={item.size} />}
    <span className="ml-2 text-[#191919]">{item.label}</span>
    <div className="flex items-center ml-auto">
      {color && (
        <div
          className="w-2.5 h-2.5 rounded-full flex-none mr-2"
          style={{ backgroundColor: color }} // 使用 style 来设置背景色
        />
      )}
      <div className="w-[20px] relative flex justify-end items-center">
        {item.count && (
          <span className="text-gray-500 group-hover:hidden">{item.count}</span>
        )}
        <span className="hidden group-hover:flex text-gray-400 text-sm absolute items-center">
          <Icon name="more" size={12} className="hover:text-black" />
        </span>
      </div>
    </div>
  </div>
);

export default SidebarItem;
