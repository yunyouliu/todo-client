import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";
import dayjs from "dayjs";
const Inbox: React.FC = () => {
  const defaultGroups: GroupConfig[] = [
    {
      key: "inboxTask",
      label: "收集箱",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.projectId === null &&
            task.status === 0 &&
            task.isDeleted === false
        ),
      defaultOpen: true,
      renderType: "list",
    },
    {
      key: "overdue",
      label: "已完成",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task &&
            task.status === 2 &&
            task.isDeleted === false &&
            task.projectId === null
        ),
      renderType: "collapse",
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
        groups={defaultGroups}
        pageTitle="本周任务"
        description="本周没有待办任务"
      />
    </div>
  );
};

export default Inbox;
