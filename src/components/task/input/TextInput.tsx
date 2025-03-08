import React, { useState, useEffect } from "react";
import { Button, Input, Popover } from "antd";
import Icon from "@/components/index/icon";
import Priority from "@/components/task/common/priority";
import Remind from "@/components/task/common/Remind";
import dayjs from "dayjs"; // 日期处理库
import isoWeek from "dayjs/plugin/isoWeek";
const { TextArea } = Input;

interface TextInputProps {
  className?: string;
  onBlur: () => void;
  value: string;
  selected: string | null;
  onChange: (newValue: string) => void;
  onPriorityChange: (newPriority: string) => void;
}

interface IconProps {
  name: string;
  size?: number;
  content: React.ReactNode;
  renderNode: React.ReactNode; // 用于合并图标和文字
}

const TextInput: React.FC<TextInputProps> = ({
  className,
  value,
  selected,
  onBlur,
  onChange,
  onPriorityChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // 当前选中的日期

  // 日期标签显示逻辑

  // 引入插件，修改一周的起始日为周一
  dayjs.extend(isoWeek);

  const getDateLabel = () => {
    if (!selectedDate) return null;

    const today = dayjs();
    const date = dayjs(selectedDate);

    // 判断是否为今天
    if (date.isSame(today, "day")) {
      return { label: "今天", color: "blue" };
    }

    // 判断是否为过去的日期
    if (date.isBefore(today, "day")) {
      if (date.isSame(today.subtract(1, "day"), "day")) {
        return { label: "昨天", color: "red" };
      }
      return {
        label:
          date.year() === today.year()
            ? date.format("M/D")
            : date.format("YYYY/M/D"),
        color: "red",
      };
    }

    // 判断是否为未来的日期
    if (date.isSame(today.add(1, "day"), "day")) {
      return { label: "明天", color: "blue" };
    }

    // 判断是否为周几（从周一开始）
    const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const weekStart = today.startOf("isoWeek"); // 获取当前周的起始时间（周一）
    for (let i = 0; i < 7; i++) {
      if (date.isSame(weekStart.add(i, "day"), "day")) {
        return { label: weekDays[i], color: "blue" };
      }
    }

    // 默认返回日期
    return {
      label:
        date.year() === today.year()
          ? date.format("M/D")
          : date.format("YYYY/M/D"),
      color: "blue",
    };
  };

  const dateLabel = getDateLabel();

  const icons: IconProps[] = [
    {
      name: "日期设置",
      size: 26,
      content: (
        <Remind
          onSelect={(date: string) => setSelectedDate(date)} // 回调函数更新选中的日期
        />
      ),
      renderNode: (
        <div className="flex items-center ml-2 mb-1 hover:bg-slate-100 p-1">
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
      size: 25,
      content: <Priority selected={selected} setSelected={onPriorityChange} />,
      renderNode: (
        <div className="flex items-center">
          <Icon
            name={
              selected === "高优先级"
                ? "red"
                : selected === "中优先级"
                  ? "yellow"
                  : selected === "低优先级"
                    ? "blue"
                    : "youxianji"
            } // 动态替换图标
            size={25}
            className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
          />
        </div>
      ),
    },
    {
      name: "移动到",
      size: 25,
      content: "移动到",
      renderNode: (
        <Icon
          name="yidongdao"
          size={25}
          className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
        />
      ),
    },
    {
      name: "标签",
      size: 25,
      content: "添加标签",
      renderNode: (
        <Icon
          name="biaoqian"
          size={25}
          className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
        />
      ),
    },
    {
      name: "更多",
      size: 25,
      content: "更多",
      renderNode: (
        <Icon
          name="more "
          size={25}
          className="cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
        />
      ),
    },
  ];

  // 监听文本输入内容，动态计算行数
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onChange(newText);

    // 计算文本行数 66一行
    const lineCount = Math.ceil(newText.length / 66);
    setRows(lineCount + 1.5 < 2.5 ? 2.5 : lineCount + 1.5);
  };
  const [rows, setRows] = useState(2.5);
  return (
    <div className={`${className} relative`}>
      <TextArea
        autoFocus
        placeholder="准备做什么？"
        autoSize={{ minRows: rows, maxRows: 6 }}
        value={value}
        onBlur={onBlur}
        rows={3}
        onChange={handleTextChange}
      />
      <div
        className="flex gap-4 items-center absolute bottom-0.5 left-0.5"
        onMouseDown={(e) => e.preventDefault()}
      >
        {icons.map((icon) => (
          <Popover
            content={icon.content}
            trigger="click"
            placement="bottom"
            arrow={false}
            key={icon.name}
            overlayInnerStyle={{ padding: 1 }}
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
        disabled={!value}
        onMouseDown={(e) => e.preventDefault()}
      >
        添加  
      </Button>
    </div>
  );
};

export default TextInput;
