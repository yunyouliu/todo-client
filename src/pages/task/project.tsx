import React, { useEffect } from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";
import dayjs from "dayjs";
import { useParams, useDispatch, useSelector } from "umi";
const Project: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [projectId, setProjectId] = React.useState<string | undefined>(id);
  const project = useSelector((state: any) =>
    state.project.projects.find((project: any) => project._id === projectId)
  );
  useEffect(() => {
    if (id) {
      setProjectId(id);
    }
    if (project) {
      dispatch({
        type: "active/setActiveLabel",
        payload: project.name,
      });
    }
  }, [id, project]);

  const defaultGroups: GroupConfig[] = [
    {
      key: "overdue",
      label: "已完成",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.dueDate &&
            dayjs(task.dueDate).isBefore(baseDate, "day") &&
            task.status === 2
        ),
      defaultOpen: true,
    },
    {
      key: "today",
      label: "任务",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) => task.projectId === projectId && task.status !== 2
        ),
      defaultOpen: true,
      renderType: "list",
    },
  ];

  return (
    <div className="w-full">
      <GenericTaskPage
        groups={defaultGroups}
        pageTitle="今日任务"
        description="今天没有任务了"
        navigateTo={`/task/p/${projectId}/task`}
      />
    </div>
  );
};

export default Project;
