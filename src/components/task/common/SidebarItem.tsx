/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-15 16:26:19
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-16 09:55:46
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
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  onClick,
}) => (
  <div
    className={`flex items-center p-2.5 text-sm cursor-pointer group focus:outline-none hover:cursor-auto hover:bg-gray-100 rounded-lg ${
      isActive ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    {item.icon && <Icon name={item.icon} size={item.size} />}
    <span className="ml-2 text-[#191919]">{item.label}</span>
    {item.count && (
      <span className="ml-auto text-gray-500 group-hover:hidden">
        {item.count}
      </span>
    )}
    <span className="ml-auto hidden group-hover:block text-gray-400 text-sm">
      <Icon name="more" size={12} className="hover:text-black" />
    </span>
  </div>
);

export default SidebarItem;
