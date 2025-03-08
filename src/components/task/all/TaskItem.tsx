import React from "react";
import CustomCheckbox from "@/components/task/common/CustomCheckbox";
import Icon from "@/components/index/icon";
import dayjs from "dayjs";

const PRIORITY_COLORS: Record<string, { borderColor: string; color: string }> =
  {
    none: { borderColor: "#9CA3AF", color: "#9CA3AF" }, // 灰色
    low: { borderColor: "#3B82F6", color: "#3B82F6" }, // 蓝色
    medium: { borderColor: "#FACC15", color: "#FACC15" }, // 黄色
    high: { borderColor: "#EF4444", color: "#EF4444" }, // 红色
  };

const TaskItem: React.FC<{
  title?: string; // 任务标题
  date: string; // 任务日期
  tags: string[]; // 任务标签
  priority?: "none" | "low" | "medium" | "high"; // 任务优先级
  checked?: boolean; // 是否选中
  hasAttachment?: boolean; // 是否有附件
  hasContent?: boolean; // 是否有内容
  hasReminder?: boolean; // 是否有提醒
  hasRepeat?: boolean; // 是否有重复
}> = ({
  title,
  date,
  tags,
  priority = "none",
  checked = true,
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

  const { borderColor, color } = PRIORITY_COLORS[priority];

  return (
    <div className="relative flex items-center py-2 border-b hover:bg-gray-100 rounded-xl p-4 group">
      {/* 左侧内容：checkbox + 任务标题 */}
      <div className="flex items-center gap-2 overflow-hidden pr-20">
        <CustomCheckbox
          checked={checked}
          borderColor={borderColor}
          color={color}
        />

        {title ? (
          <span className="text-gray-800 truncate">{title}</span>
        ) : (
          <span className="text-gray-400 truncate">无标题</span>
        )}
      </div>

      {/* 右侧内容：固定到右侧，覆盖左侧 */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center  group-hover:bg-gray-100 bg-white pl-2">
        {/* 标签 */}
        <div className="flex items-center gap-1">
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

        {/* 图标 */}
        <div className="flex ml-1 items-center gap-0.5">
          {hasContent && <Icon name="doc" />}
          {hasAttachment && <Icon name="attachment" />}
          {hasReminder && <Icon name="clock" />}
          {hasRepeat && <Icon name="repeat" />}
        </div>

        {/* 时间 */}
        <span
          className={`text-xs ml-2 ${
            isOverdue ? "text-red-500" : "text-blue-500"
          }`}
        >
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
