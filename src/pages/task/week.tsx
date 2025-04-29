import React from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";
import dayjs from "dayjs";

const Week: React.FC = () => {
  const defaultGroups: GroupConfig[] = [
    {
      key: "thisWeek",
      label: "本周任务",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.dueDate &&
            dayjs(task.dueDate).isSame(baseDate, "week") &&
            task.status !== 2
        ),
      defaultOpen: true,
    },
    {
      key: "nextWeek",
      label: "下周任务",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.dueDate &&
            dayjs(task.dueDate).isSame(
              dayjs(baseDate).add(1, "week"),
              "week"
            ) &&
            task.status !== 2
        ),
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

export default Week;
