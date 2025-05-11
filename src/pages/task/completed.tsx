import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";

const Completed: React.FC = () => {
  const defaultGroups: GroupConfig[] = [
    {
      key: "completed",
      label: "已完成的任务",
      filter: (tasks) => tasks.filter(task => task.status === 2), // 状态2为已完成
      defaultOpen: true,
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
      isVisible={false}
        groups={defaultGroups}
        pageTitle="已完成的任务"
        description="还没有完成的任务"
      />
    </div>
  );
};

export default Completed;