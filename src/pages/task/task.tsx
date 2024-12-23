/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-27 20:31:49
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-22 13:32:39
 */
/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-27 20:31:49
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-22 13:16:04
 */
import React, { useState } from "react";
import { Splitter } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Task: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // 控制侧边栏折叠状态

  return (
    <div className="h-full">
      <Splitter className="h-full shadow-sm">
        {/* 左侧面板 */}

          <Splitter.Panel size={isCollapsed ? "0%" : "20%"} min="14%" max="31%">
            <div className="p-4 bg-gray-100 h-full text-left">
              <h3 className="text-lg font-semibold">菜单</h3>
              <ul className="mt-4">
                <li className="py-2">收集箱</li>
                <li className="py-2">今天</li>
                <li className="py-2">已完成</li>
                <li className="py-2">垃圾桶</li>
              </ul>
            </div>
          </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel min="26%" max="78%">
          <div className="flex items-center p-3 ">
            {/* 折叠/展开按钮 */}
            {isCollapsed ? (
              <MenuUnfoldOutlined
                className="text-xl cursor-pointer"
                onClick={() => setIsCollapsed(false)}
              />
            ) : (
              <MenuFoldOutlined
                className="text-lg  cursor-pointer text-gray-500"
                onClick={() => setIsCollapsed(true)}
              />
            )}
            <h2 className="ml-2 text-lg font-semibold mt-2">任务管理</h2>
          </div>

          {/* 主体内容 */}
          <div className="p-4">
            <p>这里是主任务展示区域，可以动态加载内容。</p>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min="20%">3</Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default Task;
