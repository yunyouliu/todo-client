/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-12-29 11:34:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-19 15:37:00
 */
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Divider, Collapse, ConfigProvider, Modal } from "antd";
import type { CollapseProps } from "antd";
import SidebarItem from "./SidebarItem";
import { useSelector, useDispatch, useNavigate } from "umi";
import Icon from "@/components/index/icon";
import { useState } from "react";

// 👋 欢迎💼 工作任务📦 购物清单	📖学习安排🎂生日提醒🏃锻炼计划🦄心愿清单🏡个人备忘
const list = [
  {
    key: "1",
    label: "👋 欢迎",
    count: 12,
  },
  {
    key: "2",
    label: "💼 工作任务",
    count: 5,
  },
  {
    key: "3",
    label: "📦 购物清单",
    count: 8,
  },
  {
    key: "4",
    label: "📖 学习安排",
    count: 3,
  },
  {
    key: "5",
    label: "🎂 生日提醒",
    count: 2,
  },
  {
    key: "6",
    label: "🏃 锻炼计划",
    count: 7,
  },
  {
    key: "7",
    label: "🦄 心愿清单",
    count: 1,
  },
  {
    key: "8",
    label: "🏡 个人备忘",
    count: 10,
  },
];

const tag = [
  {
    key: "10086",
    label: "生日",
    icon: "biaoqian",
    color: "#35CB27",
  },
  {
    key: "10087",
    label: "生活",
    icon: "biaoqian",
    color: "rgb(241, 168, 58)",
  },
];

// 定义侧边栏组件的属性接口
interface SidebarProps {
  data: Array<{
    size: number;
    key: string;
    icon: string;
    label: string;
    color?: string;
    count?: number;
  }>;
  bottomIcons: Array<{
    size: number;
    key: string;
    icon: string;
    label: string;
    color?: string;
    count?: number;
  }>;
  activeKey: string;
  onItemClick?: (key: string, label: string) => void;
  onDragEnd?: (result: any) => void;
}

// 实现一个可拖拽的侧边栏组件
const Sidebar: React.FC<SidebarProps> = ({ data, bottomIcons, onDragEnd }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeKey } = useSelector((state: any) => state.active);
  const [open, setOpen] = useState(false);
  const handleItemClick = (key: string, label: string) => {
    dispatch({
      type: "active/setActiveKey",
      payload: key,
    });
    dispatch({
      type: "active/setActiveLabel",
      payload: label,
    });
    dispatch({
      type: "active/setIsOpen",
      payload: false,
    });
    navigate(`${key}`);
  };
  // Collapse项配置
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="text-sm text-gray-400 group">
          <span className="group-hover:text-pink-300"> 清单</span>
          <span className="bg-gray-200 ml-2 text-xs p-0.5 rounded-lg">
            已使用8/9
          </span>
          <div className="hidden group-hover:block align-middle float-right mr-2 items-center ">
            <Icon
              name="add"
              size={15}
              onClick={(e) => {
                e.stopPropagation(), setOpen(true);
              }}
            />
          </div>
        </div>
      ),
      children: (
        <div>
          {list.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              onClick={() => handleItemClick(item.key, item.label)}
            />
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="hover:text-pink-300 text-sm text-gray-400">过滤器</div>
      ),
      children: <></>,
    },
    {
      key: "3",
      label: (
        <div className="text-sm text-gray-400 group flex items-center">
          <div className="hover:text-pink-300 text-sm text-gray-400">标签</div>
          <div className="hidden group-hover:flex ml-auto gap-3 mr-2 text-pink-200">
            <Icon name="more" size={15} />
            <Icon name="add" size={15} />
          </div>
        </div>
      ),
      children: (
        <div>
          {tag.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              color={item.color}
              onClick={() => handleItemClick(item.key, item.label)}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="select-none scroll-smooth">
      <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
        <DragDropContext onDragEnd={onDragEnd || (() => {})}>
          <Droppable droppableId="sidebar">
            {(provided) => (
              <div
                className="bg-white p-2 mt-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data.map((item, index) => (
                  <Draggable
                    key={item.key}
                    draggableId={item.key}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          cursor: "pointer",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <SidebarItem
                          item={item}
                          onClick={() => handleItemClick(item.key, item.label)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Divider />
        <div>
          <Collapse
            items={items}
            bordered={false}
            size="small"
            className="bg-white text-left p-2 ml-2"
            ghost
          />
        </div>

        <Divider />
        <div className="p-2">
          {bottomIcons.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              color={item.color}
              onClick={() => handleItemClick(item.key, item.label)}
            />
          ))}
        </div>
        <Modal
          width="48%"
          title="新建清单"
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          style={{ top: "20%", padding: "0px" }}
          mask={false}
          footer={null}
        >
          <div className="flex ">
            <div className="bg-white w-1/2">111</div>
            <div className="bg-blue-300 w-1/2">111</div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Sidebar;
