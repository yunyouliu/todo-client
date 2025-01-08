/*
 * @Descripttion: 实现一个可拖拽的侧边栏组件
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-12-29 11:34:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-05 10:34:40
 */
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DashOutlined } from "@ant-design/icons";
// 定义侧边栏组件的属性接口
interface SidebarProps {
  data: Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
    count?: number;
  }>;
  activeKey: string;
  onItemClick?: (key: string, label: string) => void;
  onDragEnd?: (result: any) => void;
}

// 实现一个可拖拽的侧边栏组件
const Sidebar: React.FC<SidebarProps> = ({
  data,
  activeKey,
  onItemClick,
  onDragEnd,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd || (() => {})}>
      <Droppable droppableId="sidebar">
        {(provided) => (
          <div
            className="bg-white p-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.map((item, index) => (
              <Draggable key={item.key} draggableId={item.key} index={index}>
                {(provided) => (
                  // eslint-disable-line no-inline-style
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      cursor: "pointer",
                      ...provided.draggableProps.style,
                    }}
                    className={`flex items-center p-3 cursor-pointer group focus:outline-none  hover:cursor-auto  hover:bg-gray-100 rounded-lg ${
                      activeKey === item.key ? "bg-gray-100" : ""
                    }`}
                    onClick={() =>
                      onItemClick && onItemClick(item.key, item.label)
                    }
                  >
                    {item.icon}
                    <span className="ml-2 text-[#191919]">{item.label}</span>
                    {item.count && (
                      <span className="ml-auto text-gray-500 group-hover:hidden">
                        {item.count}
                      </span>
                    )}
                    <span className="ml-auto hidden group-hover:block text-gray-400 hover:text-gray-700 text-sm">
                      <DashOutlined />
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sidebar;
