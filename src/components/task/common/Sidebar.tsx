/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-12-29 11:34:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-19 15:37:00
 */
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Divider,
  Collapse,
  ConfigProvider,
  Modal,
  Button,
  ColorPicker,
  Input,
} from "antd";
import type { CollapseProps } from "antd";
import SidebarItem from "./SidebarItem";
import { useSelector, useDispatch, useNavigate } from "umi";
import Icon from "@/components/index/icon";
import { useState } from "react";
import type { ITag } from "@/models/tag";
import objectId from "bson-objectid";

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
}

// 实现一个可拖拽的侧边栏组件
const Sidebar: React.FC<SidebarProps> = ({ data, bottomIcons }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeKey } = useSelector((state: any) => state.active);
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#5E7CE0"); // 默认颜色蓝色
  // const { sidebarData, buttomIcons } = useSelector(
  //   (state: any) => state.sidebar
  // );
  const { projects } = useSelector((state: any) => state.project);
  const tags = useSelector((state: any) => state.tag.tags).filter(
    (item: { isDeleted: boolean }) => item.isDeleted === false
  );
  const handleItemClick = (key: string, label: string, otherkey?: string) => {
    dispatch({
      type: "active/setActiveKey",
      payload: key,
    });
    if (otherkey == "/task/t/") {
      console.log("#" + label);
      dispatch({
        type: "active/setActiveLabel",
        payload: "#" + label,
      });
    } else {
      dispatch({
        type: "active/setActiveLabel",
        payload: label,
      });
    }

    dispatch({
      type: "active/setIsOpen",
      payload: false,
    });
    if (otherkey) {
      navigate(otherkey + key);
    } else {
      navigate(key);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(data);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);

    dispatch({
      type: "sidebar/reorderSidebarData",
      payload: newItems,
    });
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
            <Icon name="add" size={15} />
          </div>
        </div>
      ),
      children: (
        <div>
          {projects.map((item: any) => (
            <SidebarItem
              key={item._id}
              item={{ key: item._id, label: item.name }}
              onClick={() => handleItemClick(item._id, item.name, "/task/p/")}
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
          {tags.map((item: { _id: string; name: string; color?: string }) => (
            <SidebarItem
              key={item._id}
              item={{ key: item._id, label: item.name }}
              color={item.color}
              onClick={() => handleItemClick(item._id, item.name, "/task/t/")}
            />
          ))}
        </div>
      ),
    },
  ];

  const handSaveTag = () => {
    if (!tagName.trim()) return;
    const newTag: Partial<ITag> = {
      _id: objectId().toString(), // objectid
      name: tagName,
      user: localStorage.getItem("user_id") || "", // 假设用户ID存储在localStorage
      color: selectedColor,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({
      type: "tag/addTag",
      payload: newTag,
    });
    setOpen(false);
  };

  const handCancel = () => {
    setOpen(false);
  };

  return (
    <div className="select-none scroll-smooth">
      <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sidebar">
            {(provided) => (
              <div
                className="bg-white p-2 mt-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data.map(
                  (
                    item: { key: string; label: string; color?: string },
                    index: number
                  ) => (
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
                            key={item.key}
                            item={item}
                            onClick={() =>
                              handleItemClick(item.key, item.label)
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                )}
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
          {bottomIcons.map(
            (item: { key: string; label: string; color?: string }) => (
              <SidebarItem
                key={item.key}
                item={item}
                color={item.color}
                onClick={() => handleItemClick(item.key, item.label)}
              />
            )
          )}
        </div>
        <Modal
          closable
          title={<span>添加标签</span>}
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          style={{ top: "20%", padding: "0px" }}
          mask={false}
          footer={null}
        >
          <div className="p-6 space-y-4">
            <Input
              type="text"
              size="small"
              placeholder="名称"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full  rounded-md p-2"
            />
            <div className="flex items-center space-x-4 mt-4">
              <label className="block text-sm font-medium">颜色</label>
              <ColorPicker
                size="small"
                value={selectedColor}
                onChange={(color) => setSelectedColor(color.toHexString())} // 保存十六进制颜色值
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="default"
                onClick={() => {
                  handCancel();
                  setOpen(false);
                  setTagName("");
                  setSelectedColor("#5E7CE0"); // 重置颜色
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                关闭
              </Button>
              <Button
                type="primary"
                onClick={handSaveTag}
                disabled={!tagName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </Button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Sidebar;
