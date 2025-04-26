import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";
import dayjs from "dayjs";

const Today: React.FC = () => {
  const defaultGroups: GroupConfig[] = [
    {
      key: "overdue",
      label: "已过期",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.status !== 2 &&
            task.dueDate &&
            dayjs(task.dueDate).isBefore(baseDate, "day")
        ),
      extra: <span className="text-blue-500 text-xs cursor-pointer">顺延</span>,
      defaultOpen: true,
    },
    {
      key: "today",
      label: "今天",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.dueDate &&
            dayjs(task.dueDate).isSame(baseDate, "day") &&
            task.status !== 2
        ),
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
        groups={defaultGroups}
        pageTitle="今日任务"
        description="今天没有任务了"
      />
    </div>
  );
};

export default Today;
