import React from "react";
import { Checkbox } from "antd";

interface TaskItemProps {
  title: string;
  tags?: string[];
  isCompleted?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, tags, isCompleted }) => {
  return (
    <div className="flex items-center space-x-4">
      <Checkbox checked={isCompleted} />
      <span className={`flex-1 ${isCompleted ? "line-through text-gray-500" : ""}`}>
        {title}
      </span>
      {tags?.map((tag, index) => (
        <span key={index} className="text-xs bg-blue-100 px-2 py-1 rounded-lg">
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TaskItem;
