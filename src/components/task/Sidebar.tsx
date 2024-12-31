/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-12-29 11:34:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-31 16:38:36
 */
import React from "react";
import { SidebarProps } from "./types";

const Sidebar: React.FC<SidebarProps> = ({ data, activeKey, onItemClick }) => {
  return (
    <div className=" bg-white p-2">
      {data.map((item) => (
        <div
          key={item.key}
          className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg ${
            activeKey === item.key ? "bg-gray-100" : ""
          }`}
          onClick={() => onItemClick(item.key)}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
          {item.count && (
            <span className="ml-auto text-gray-500">{item.count}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
