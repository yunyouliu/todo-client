import React, { useState, useEffect } from "react";
import { Button, Input, Popover } from "antd";
import Icon from "@/components/index/icon";
import Priority from "@/components/task/common/priority";
import Remind from '@/components/task/common/Remind'
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
  IconName: string;
  size?: number;
  content: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({
  className,
  value,
  selected,
  onBlur,
  onChange,
  onPriorityChange,
}) => {
  const icons: IconProps[] = [
    {
      name: "日期设置",
      IconName: "rili",
      size: 20,
      content: <Remind />,
    },
    {
      name: "优先级",
      IconName:
        selected === "高优先级"
          ? "red"
          : selected === "中优先级"
            ? "yellow"
            : selected === "低优先级"
              ? "blue"
              : "youxianji", // 动态替换图标
      size: 20,
      content: <Priority selected={selected} setSelected={onPriorityChange} />,
    },
    {
      name: "移动到",
      IconName: "yidongdao",
      size: 20,
      content: "移动到",
    },
    {
      name: "标签",
      IconName: "biaoqian",
      size: 20,
      content: "添加标签",
    },
    {
      name: "更多",
      IconName: "gengduo",
      size: 20,
      content: "更多",
    },
  ];

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("icon click");
  };

  return (
    <div className={` ${className}`}>
      <TextArea
        autoFocus
        placeholder="准备做什么？"
        autoSize={{ minRows: 2.5, maxRows: 6 }}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
      />
      <div
        className="flex -translate-y-8 items-center"
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
            <Icon
              name={icon.IconName}
              size={26}
              className="ml-3 cursor-pointer text-gray-300 rounded-lg hover:bg-slate-100 p-0.5"
              onClick={handleIconClick}
            />
          </Popover>
        ))}
      </div>
      <Button
        size="small"
        className="float-right mb-1 -translate-y-14 mr-3"
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
