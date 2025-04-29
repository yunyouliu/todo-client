import React, { useState, useCallback, useMemo, useEffect } from "react";
import { PriorityCheckbox } from "@/components/task/common/CustomCheckbox";
import Icon from "@/components/index/icon";
import dayjs from "dayjs";
import { useNavigate, useLocation, useSelector, useDispatch } from "umi";
import { Tooltip } from "antd";

const TaskItem: React.FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const task = useSelector((state: any) =>
    state.task.tasks.find((t: any) => t._id === id)
  );

  if (!task) return null;

  const {
    title: initialTitle,
    dueDate,
    tags,
    priority = 0,
    status,
    attachments = [],
    content,
    reminders = [],
    repeatFlag,
    columnId,
  } = task;

  const Tags = useSelector((state: any) => state.tag.tags);
  const checked = status === 2;
  const hasAttachment = attachments.length > 0;
  const hasContent = !!content;
  const hasReminder = reminders.length > 0;
  const hasRepeat = !!repeatFlag;

  const now = dayjs();
  const taskDate = dueDate ? dayjs(dueDate) : null;

  // 检查 taskDate 是否有效
  if (taskDate && !taskDate.isValid()) {
    console.error("Invalid dueDate:", dueDate);
  }

  const isOverdue = taskDate?.isBefore(now, "day");
  const isThisYear = taskDate?.year() === now.year();
  const formattedDate = taskDate
    ? isThisYear
      ? taskDate.format("M月D日")
      : taskDate.format("YYYY年M月D日")
    : "";

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "无标题");
  const [matchTags, setMatchTags] = useState<string[]>([]);

  useEffect(() => {
    const matched = tags
      ?.map((tag: any) => Tags.find((t: any) => t._id === tag))
      .filter(Boolean) as any[];
    setMatchTags(matched);
  }, [tags, Tags]);

  useEffect(() => {
    setTitle(initialTitle || "无标题");
  }, [initialTitle]);

  const handleStatusClick = useCallback(() => {
    dispatch({
      type: "task/updateTask",
      payload: {
        id,
        changes: { status: checked ? 0 : 2 },
      },
    });
  }, [id, checked]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      dispatch({
        type: "task/updateTask",
        payload: {
          id,
          changes: { title: e.target.value },
        },
      });
    },
    [id]
  );

  const handleBlur = () => {
    if (!title.trim()) {
      setTitle("无标题");
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setIsEditing(false);
  };

  const handleTitleClick = useCallback(() => {
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    let newPath = /^[a-zA-Z]+$/.test(lastPart)
      ? `${location.pathname}/${id}`
      : location.pathname.replace(/\/[^/]+$/, `/${id}`);

    if (newPath !== location.pathname) {
      navigate(newPath);
      setIsEditing(true);
    }
  }, [id, location.pathname, navigate]);

  const isActive = useCallback(() => {
    return location.pathname.includes(id);
  }, [id, location.pathname]);

  const bgclassName = useMemo(() => {
    return isActive() ? "bg-gray-100" : "bg-white";
  }, [isActive]);

  const textClass = useMemo(
    () => (title === "" || checked ? "text-[#19191933]" : "text-gray-800"),
    [title, checked]
  );

  const showTime = useMemo(() => {
    return taskDate
      ? taskDate.isSame(now, "day")
        ? "今天"
        : taskDate.isSame(now.add(1, "day"), "day")
          ? "明天"
          : taskDate.isSame(now.subtract(1, "day"), "day")
            ? "昨天"
            : taskDate.isSame(now, "week")
              ? taskDate.format("dddd") // 显示周几
              : formattedDate
      : "";
  }, [taskDate, now]);
  return (
    <div
      className={`relative flex items-center py-2 border-b hover:bg-gray-100 rounded-xl p-4 group ${bgclassName}`}
      onClick={handleTitleClick}
    >
      <div className="flex items-center gap-2 overflow-hidden pr-20">
        <PriorityCheckbox
          priority={priority}
          checked={checked}
          onClick={handleStatusClick}
        />
        <div className="flex items-center w-full min-h-[24px]">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full bg-transparent border-none leading-6 focus:outline-none ${textClass}`}
              placeholder="无标题"
            />
          ) : (
            <span
              className={`truncate w-auto cursor-text min-h-[24px] leading-6 ${textClass}`}
            >
              {title}
            </span>
          )}
        </div>
      </div>

      <div
        className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center group-hover:bg-gray-100 ${bgclassName} pl-2`}
      >
        <div className="flex items-center gap-1 cursor-pointer">
          {matchTags?.map((tag: any, index) => (
            <span
              key={index}
              className="rounded-xl px-[8px] py-0 text-[12px] hover:bg-primary-60 text-grey-100"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <span
          className={`text-xs ml-0.5 cursor-pointer hover:underline ${
            checked ? "text-[#19191933]" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/task/inbox/${columnId || "inbox"}`);
          }}
        >
          收集箱
        </span>

        <div className="flex ml-1 items-center gap-0.5">
          {hasContent && <Icon name="doc" />}
          {hasAttachment && <Icon name="attachment" />}
          {hasReminder && <Icon name="clock" />}
          {hasRepeat && <Icon name="repeat" />}
        </div>
        <Tooltip
          arrow={false}
          title={<span className="m-auto -translate-y-5">{showTime}</span>}
          placement="top"
          trigger="hover"
        >
          <span
            className={`text-xs ml-2 cursor-pointer ${
              checked
                ? "text-[#19191933]"
                : isOverdue
                  ? "text-red-500"
                  : "text-blue-500"
            }`}
          >
            {showTime}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default TaskItem;
