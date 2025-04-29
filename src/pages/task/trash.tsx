import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";

const Trash: React.FC = () => {
  const defaultGroups: GroupConfig[] = [
    {
      key: "trash",
      label: "回收站",
      filter: (tasks) => tasks.filter((task) => task.isDeleted), 
      defaultOpen: true,
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
        groups={defaultGroups}
        pageTitle="回收站"
        description="回收站是空的"
      />
    </div>
  );
};

export default Trash;
