import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";

const Abandoned: React.FC = () => {
  const defaultGroups: GroupConfig[] = [
    {
      key: "abandoned",
      label: "已放弃的任务",
      filter: (tasks) => tasks.filter((task) => task.status === 4),
      defaultOpen: true,
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
        groups={defaultGroups}
        pageTitle="已放弃的任务"
        description="这里没有放弃的任务"
      />
    </div>
  );
};

export default Abandoned;
