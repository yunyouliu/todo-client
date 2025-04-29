import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";
import dayjs from "dayjs";

const Tomorrow: React.FC = () => {
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
      key: "tomorrow",
      label: "明天",
      filter: (tasks) =>
        tasks.filter(
          (task) =>
            task.status !== 2 &&
            task.dueDate &&
            dayjs(task.dueDate).isSame(dayjs().add(1, "day"), "day")
        ),
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
        groups={defaultGroups}
        pageTitle="收集箱"
        initDate={dayjs().add(1, "day")}
      />
    </div>
  );
};

export default Tomorrow;
