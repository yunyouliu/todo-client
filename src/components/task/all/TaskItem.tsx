import React, { useState, useCallback, useMemo } from "react";
import CustomCheckbox from "@/components/task/common/CustomCheckbox";
import Icon from "@/components/index/icon";
import dayjs from "dayjs";
import { useNavigate, useLocation, useDispatch } from "umi";

const PRIORITY_COLORS: Record<string, { borderColor: string; color: string }> =
  {
    none: { borderColor: "#9CA3AF", color: "#9CA3AF" }, // 灰色
    low: { borderColor: "#3B82F6", color: "#3B82F6" }, // 蓝色
    medium: { borderColor: "#FACC15", color: "#FACC15" }, // 黄色
    high: { borderColor: "#EF4444", color: "#EF4444" }, // 红色
  };

const TaskItem: React.FC<{
  id: string;
  title?: string; // 任务标题
  date: string; // 任务日期
  List?: string;
  ListId?: string;
  tags: string[]; // 任务标签
  priority?: "none" | "low" | "medium" | "high"; // 任务优先级
  checked?: boolean; // 是否完成
  hasAttachment?: boolean; // 是否有附件
  hasContent?: boolean; // 是否有内容
  hasReminder?: boolean; // 是否有提醒
  hasRepeat?: boolean; // 是否有重复
}> = ({
  id,
  title: initialTitle,
  date,
  tags,
  List = "收集箱",
  ListId = "inbox",
  priority = "none",
  checked = false,
  hasAttachment = false,
  hasContent = false,
  hasReminder = false,
  hasRepeat = false,
}) => {
  const now = dayjs();
  const taskDate = dayjs(date);
  const isOverdue = taskDate.isBefore(now, "day");
  const isThisYear = taskDate.year() === now.year();
  const formattedDate = isThisYear
    ? taskDate.format("M月D日")
    : taskDate.format("YYYY年M月D日");
  const priorityStyles = useMemo(() => PRIORITY_COLORS[priority], [priority]);
  const { borderColor, color } = priorityStyles;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "无标题");
  const navigate = useNavigate();
  const location = useLocation(); // 判断当前路径是否已包含 ID
  const textClass = useMemo(
    () => (checked ? "text-[#19191933]" : "text-gray-800"),
    [checked]
  );
  const dispatch = useDispatch();
  /** 处理输入框变化 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleTitleClick = useCallback(() => {
    if (!id) return;
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    let newPath;
    if (/^\d+$/.test(lastPart)) {
      newPath = location.pathname.replace(/\/\d+$/, `/${id}`);
    } else {
      newPath = `${location.pathname}/${id}`;
    }

    navigate(newPath);
    setIsEditing(true);
  }, [id, location.pathname, navigate]);

  /** 处理回车确认 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  /** 失去焦点时确认修改 */
  const handleBlur = () => {
    if (!title.trim()) {
      setTitle("无标题"); // 防止空值
    }
    setIsEditing(false);
  };

  const isActive = useCallback(() => {
    return location.pathname.match(id);
  }, [id, location.pathname, navigate]);

  const bgclassName = useMemo(() => {
    return isActive() ? "bg-gray-100" : "bg-white";
  }, [isActive]);

  return (
    <div
      className={`relative flex items-center py-2 border-b hover:bg-gray-100 rounded-xl  p-4 group ${bgclassName}`}
      onClick={handleTitleClick}
    >
      {/* 左侧内容：checkbox + 任务标题 */}
      <div className="flex items-center gap-2 overflow-hidden pr-20">
        <CustomCheckbox
          checked={checked}
          borderColor={checked ? "#9CA3AF" : borderColor}
          color={checked ? "#9CA3AF" : color}
        />
        <div className="flex items-center w-full min-h-[24px]">
          {/* 可编辑任务标题 */}
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full min-w-[100px] bg-transparent border-none min-h-[24px] leading-6 focus:outline-none ${textClass}  p-0 m-0 task-input`}
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

      {/* 右侧内容 */}
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center group-hover:bg-gray-100 ${bgclassName}  pl-2`}>
        {/* 标签 */}
        <div className="flex items-center gap-1 cursor-pointer">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`rounded-xl px-2 py-1 text-xs ${
                tag === "生日" ? "bg-pink-300" : "bg-yellow-300"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        {/* 清单 */}
        <span
          className={`${checked ? "text-[#19191933]" : ""} text-xs ml-0.5 cursor-pointer hover:underline`}
          onClick={() => navigate(`/list/${ListId}`)}
        >
          {List}
        </span>

        {/* 图标 */}
        <div className="flex ml-1 items-center gap-0.5">
          {hasContent && <Icon name="doc" />}
          {hasAttachment && <Icon name="attachment" />}
          {hasReminder && <Icon name="clock" />}
          {hasRepeat && <Icon name="repeat" />}
        </div>

        {/* 时间 */}
        <span
          className={`text-xs ml-2 cursor-pointer ${
            checked
              ? "text-[#19191933]"
              : isOverdue
                ? "text-red-500"
                : "text-blue-500"
          }`}
        >
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
