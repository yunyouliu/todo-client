import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Popover, InputRef } from "antd";
import Icon from "@/components/index/icon";
import Priority from "@/components/task/common/priority";
import Remind from "@/components/task/common/Remind";
import dayjs from "dayjs";
import List from "@/components/task/common/List";
import { getDateLabel } from "@/utils/getDateLabel";
import Tags from "@/components/task/common/Tag";
import { zh } from "chrono-node";
import useMediaQuery from "@/hooks/useMediaQuery";

const { TextArea } = Input;
interface TextInputProps {
  className?: string;
  initDate: string;
  onBlur: () => void;
  value: string;
  selected: number | null;
  projectId: string;
  setProjectId: (newId: string) => void;
  tags: string[];
  setRemindInfo: (newRemindInfo: {
    remindTime?: string;
    repeatRule?: RepeatRule;
    isAllDay?: boolean;
    timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  }) => void;
  onSubmit: () => void;
  setTags: (newTags: string[]) => void;
  onChange: (newValue: string) => void;
  onDateSelect?: (date: string) => void;
  onPriorityChange: (newPriority: number, lable: string) => void;
}

interface IconProps {
  name: string;
  size?: number;
  content: React.ReactNode;
  renderNode: React.ReactNode;
  popoverKey: string;
}
type RepeatType = "daily" | "weekly" | "monthly" | "yearly" | null;
type RepeatRule = {
  type: RepeatType;
  until?: string; // 重复结束时间（ISO格式）
};

const TextInput: React.FC<TextInputProps> = ({
  className, // 自定义类名
  initDate, // 初始日期
  value, // 输入框内容
  selected, // 优先级
  projectId, // 项目ID
  setProjectId, // 提醒信息
  onSubmit, // 提交事件处理函数
  tags = [],
  setTags, // 设置标签
  onBlur, // 失去焦点事件处理函数
  onChange, // 输入框内容变化事件处理函数
  onDateSelect,
  setRemindInfo, // 设置提醒信息
  onPriorityChange, // 优先级变化事件处理函数
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(initDate); // 当前选中的日期
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ListRef = useRef<InputRef>(null);
  const dateLabel = getDateLabel(selectedDate);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});
  const isMobile = useMediaQuery("(min-width: 499)"); // 判断是否为移动端
  const getIconName = (Priority: number): string => {
    switch (Priority) {
      case 3:
        return "red";
      case 2:
        return "yellow";
      case 1:
        return "blue";
      default:
        return "none";
    }
  };

  const icons: IconProps[] = [
    {
      name: "日期",
      popoverKey: "date", // 唯一标识
      size: 26,
      content: (
        <Remind
          initDate={selectedDate || initDate}
          onSelect={(data) => {
            setRemindInfo({
              remindTime: data.remindTime,
              timeRange: data.timeRange ?? undefined,
              isAllDay: data.isAllDay,
              repeatRule: data.repeatRule,
            });
            onDateSelect?.(data.remindTime); // 可选：同步日期
            setSelectedDate(data.remindTime);
            handlePopoverVisibility("date", false); // 关闭日期Popover
          }}
        />
      ),
      renderNode: (
        <div
          className="flex items-center ml-2 mb-1 hover:bg-slate-100 p-1"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Icon
            name={selectedDate ? `day${dayjs(selectedDate).date()}` : "rili"} // 动态设置日期图标
            size={20}
            className="cursor-pointer text-gray-300 rounded-lg "
          />
          {dateLabel && (
            <span
              className="ml-1 text-xs"
              style={{ color: dateLabel.color || "black" }} // 控制文字颜色
            >
              {dateLabel.label}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "优先级",
      popoverKey: "priority",
      size: 25,
      content: (
        <Priority
          selected={selected}
          setSelected={(newPri, label) => {
            onPriorityChange(newPri, label);
            handlePopoverVisibility("priority", false); // 关闭优先级
          }}
        />
      ),
      renderNode: (
        <div className="flex items-center">
          <Icon
            name={getIconName(selected || 0)} // 动态替换图标
            size={25}
            className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
          />
        </div>
      ),
    },
    {
      name: "移动到",
      popoverKey: "project",
      size: 25,
      content: (
        <List
          ref={ListRef}
          onProjectSelect={({ id, name }) => {
            setProjectId(id); // 设置传给父组件的 projectId
            console.log(id, "项目ID"); // 打印项目ID
            setProjectName(name); // 设置回显显示的项目名称
            handlePopoverVisibility("project", false); // 关闭项目选择
          }}
        />
      ),
      renderNode: (
        <div>
          {projectName ? (
            <span className="text-sm text-blue-500  rounded p-1 hover:bg-gray-100 mr-1">
              {projectName}
            </span>
          ) : (
            <Icon
              name="move"
              size={25}
              className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
            />
          )}
        </div>
      ),
    },
    {
      name: "标签",
      popoverKey: "tags",
      size: 25,
      content: (
        <Tags
          selectedTags={tags}
          onTagsSelect={(newTags) => {
            setTags(newTags); // 更新标签状态
            handlePopoverVisibility("tags", false); // 关闭标签选择
          }}
        />
      ),
      renderNode: (
        <Icon
          name={(tags?.length || 0) > 0 ? "tags-copy" : "tags"} // 根据标签数量切换图标
          size={25}
          className={`cursor-pointer rounded-lg hover:bg-slate-100 p-0.5 ${
            tags.length > 0 ? "text-blue-500" : "text-gray-300" // 选中时改变颜色
          }`}
        />
      ),
    },
    {
      name: "更多",
      popoverKey: "more",
      size: 25,
      content: null,
      renderNode: (
        <Icon
          name="more "
          size={25}
          className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
        />
      ),
    },
  ];

  // 统一控制Popover开关的方法
  const handlePopoverVisibility = (key: string, visible: boolean) => {
    setOpenPopovers((prev) => ({ ...prev, [key]: visible }));
  };
  // 监听文本输入内容，动态计算行数
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onChange(newText);
    // -------------------------------------
    // 仅解析日期用于显示反馈（不修改输入内容）
    const parsedDate = zh.parse(newText);
    console.log("解析的日期:", parsedDate);
    if (parsedDate.length > 0) {
      let date = dayjs(parsedDate[0].start.date());

      // 判断是否包含明确时间
      const hasExplicitTime =
        parsedDate[0].start.isCertain("hour") ||
        parsedDate[0].start.isCertain("minute");

      // 如果没有明确时间，设置默认9点
      if (!hasExplicitTime) {
        date = date.set("hour", 9).set("minute", 0);
      }
      const dateStr = date.format("YYYY-MM-DD HH:mm");
      console.log("提取的日期:", dateStr);
      setSelectedDate(dateStr); // 更新本地状态
      onDateSelect?.(dateStr); // 同步到父组件
    }

    // 计算文本行数 66一行
    const lineCount = Math.ceil(newText.length / (isMobile ? 66 : 32));
    setRows(lineCount + 1.5 < 2.5 ? 2.5 : lineCount + 1.5);
  };
  const [rows, setRows] = useState(2.5);

  const handleBlur = (e: React.FocusEvent) => {
    e.preventDefault();
    onBlur();
  };

  return (
    <div className={`${className} relative`}>
      <TextArea
        ref={inputRef}
        autoFocus
        placeholder="准备做什么？"
        autoSize={{ minRows: rows, maxRows: 6 }}
        value={value}
        onBlur={handleBlur}
        rows={3}
        onChange={handleTextChange}
      />
      <div className="flex gap-4 items-center absolute bottom-0.5 left-0.5 custom-icon">
        {icons.map((icon) => (
          <Popover
            content={icon.content}
            trigger="click"
            placement="bottom"
            arrow={false}
            key={icon.name}
            overlayInnerStyle={{ padding: 1 }}
            open={openPopovers[icon.popoverKey]}
            onOpenChange={(visible) =>
              handlePopoverVisibility(icon.popoverKey, visible)
            }
          >
            {icon.renderNode}
          </Popover>
        ))}
      </div>
      <Button
        size="small"
        // className="float-right mr-3"
        className="absolute bottom-2 right-2"
        type="primary"
        disabled={!value || value.trim() === ""}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onSubmit}
      >
        添加
      </Button>
    </div>
  );
};

export default TextInput;
