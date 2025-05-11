import React, { useEffect } from "react";
import GenericTaskPage, {
  GroupConfig,
} from "@/components/task/all/GenericTaskList";
import dayjs from "dayjs";
import { useParams, useDispatch, useSelector } from "umi";
const Tags: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [tagId, setTagId] = React.useState<string | undefined>(id);

  const tags = useSelector((state: any) => state.tag.tags).filter(
    (item: { isDeleted: boolean }) => item.isDeleted === false
  );
  const tag = tags.find((tag: { _id: string }) => tag._id === tagId);

  useEffect(() => {
    if (id) {
      setTagId(id);
    }
    if (tag) {
      dispatch({
        type: "active/setActiveLabel",
        payload: tag.name,
      });
    }
  }, [id, tag]);

  const defaultGroups: GroupConfig[] = [
    {
      key: "today",
      label: "任务",
      filter: (tasks, baseDate) =>
        tasks.filter(
          (task) =>
            task.tags &&
            tag &&
            tagId &&
            task.tags.includes(tagId) &&
            task.status !== 2
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
        navigateTo={`/task/t/${tagId}/task`}
      />
    </div>
  );
};

export default Tags;
