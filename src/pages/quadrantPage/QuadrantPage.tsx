import React, { useState } from "react";
import { Card, Checkbox, Typography } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

// 定义任务类型
interface Task {
  id: string;
  text: string;
}

// 定义象限类型
interface Quadrant {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const QuadrantPage: React.FC = () => {
  // 样式类
  const containerStyle = "grid grid-cols-2 gap-2 p-4 ";
  const cardHeaderStyle = "flex justify-between items-center text-sm font-bold";
  const emptyStyle = "text-center text-gray-400 mt-4";

  const { Title } = Typography;

  // 初始化任务数据
  const [quadrants, setQuadrants] = useState<Quadrant[]>([
    { id: "quadrant-1", title: "重要且紧急", color: "text-red-500", tasks: [] },
    {
      id: "quadrant-2",
      title: "重要不紧急",
      color: "text-yellow-500",
      tasks: [],
    },
    {
      id: "quadrant-3",
      title: "不重要但紧急",
      color: "text-blue-500",
      tasks: [],
    },
    {
      id: "quadrant-4",
      title: "不重要不紧急",
      color: "text-green-500",
      tasks: [
        { id: "1", text: "看板、时间线视图：可视化管理" },
        { id: "2", text: "订阅日历：不再错过重要日程" },
        { id: "3", text: "更多特色功能" },
      ],
    },
  ]);

  // 处理拖拽结束事件
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // 如果没有目标区域，直接返回
    if (!destination) return;

    if (type === "quadrant") {
      // 处理象限拖拽
      const newQuadrants = Array.from(quadrants);
      const [movedQuadrant] = newQuadrants.splice(source.index, 1);
      newQuadrants.splice(destination.index, 0, movedQuadrant);
      setQuadrants(newQuadrants);
    } else if (type === "task") {
      // 获取源象限和目标象限
      const sourceQuadrantIndex = quadrants.findIndex(
        (q) => q.id === source.droppableId
      );
      const destinationQuadrantIndex = quadrants.findIndex(
        (q) => q.id === destination.droppableId
      );

      if (sourceQuadrantIndex === destinationQuadrantIndex) {
        // 同象限拖拽
        const tasks = Array.from(quadrants[sourceQuadrantIndex].tasks);
        const [movedTask] = tasks.splice(source.index, 1);
        tasks.splice(destination.index, 0, movedTask);

        const newQuadrants = [...quadrants];
        newQuadrants[sourceQuadrantIndex].tasks = tasks;
        setQuadrants(newQuadrants);
      } else {
        // 跨象限拖拽
        const sourceTasks = Array.from(quadrants[sourceQuadrantIndex].tasks);
        const destinationTasks = Array.from(
          quadrants[destinationQuadrantIndex].tasks
        );

        const [movedTask] = sourceTasks.splice(source.index, 1);
        destinationTasks.splice(destination.index, 0, movedTask);

        const newQuadrants = [...quadrants];
        newQuadrants[sourceQuadrantIndex].tasks = sourceTasks;
        newQuadrants[destinationQuadrantIndex].tasks = destinationTasks;

        setQuadrants(newQuadrants);
      }
    }
  };

  return (
    <div className="h-full w-full">
      <Title level={4} className="text-left translate-y-3 ml-4">
        四象限
      </Title>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="all-quadrants"
          direction="horizontal"
          type="quadrant"
        >
          {(provided) => (
            <div
              className={containerStyle}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {quadrants.map((quadrant, index) => (
                <Draggable
                  key={quadrant.id}
                  draggableId={quadrant.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        title={
                          <div className={cardHeaderStyle}>
                            <span className={quadrant.color}>
                              {quadrant.title}
                            </span>
                            <div className="items-center space-x-2 hidden group-hover:flex">
                              <PlusOutlined className="cursor-pointer" />
                              <MoreOutlined className="cursor-pointer" />
                            </div>
                          </div>
                        }
                        className="h-[328px] group cursor-pointer"
                        styles={{header:{borderBottom:"none"}}}
                      >
                        <Droppable droppableId={quadrant.id} type="task">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {quadrant.tasks.length === 0 ? (
                                <div className={emptyStyle}>没有任务</div>
                              ) : (
                                <ul className="space-y-2">
                                  {quadrant.tasks.map((task, taskIndex) => (
                                    <Draggable
                                      key={task.id}
                                      draggableId={task.id}
                                      index={taskIndex}
                                    >
                                      {(provided) => (
                                        <li
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="flex items-center bg-white p-2 rounded shadow"
                                        >
                                          <Checkbox>{task.text}</Checkbox>
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                </ul>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default QuadrantPage;
