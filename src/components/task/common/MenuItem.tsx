/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-16 11:13:05
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-16 17:21:25
 */
import React from "react";
import Icon from "@/components/index/icon";

interface MenuItemProps {
  icon?: string; // 图标名称（可选）
  label: string; // 显示文本
  size?: number; // 图标大小（可选）
  onClick?: () => void; // 点击事件处理函数（可选）
  showMore?: boolean; // 是否显示更多图标（可选）
  className?: string; // 自定义类名（可选）
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  size = 16, // 默认图标大小
  onClick,
  className = "",
}) => (
  <div
    className={`flex items-center h-9 p-2 text-sm rounded-sm cursor-pointer group focus:outline-none hover:cursor-auto hover:bg-gray-100 ${className}`}
    onClick={onClick}
  >
    {icon && <Icon name={icon} size={size} />}
    <span className="ml-2 text-[#191919] text-[13px]">{label}</span>
  </div>
);

export default MenuItem;
