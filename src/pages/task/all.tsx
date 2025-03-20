/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-04 20:02:11
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-12 18:40:27
 */
import React, { useState } from "react";
import TextInput from "@/components/task/input/TextInput";
import { Input, Collapse, ConfigProvider } from "antd";
import type { CollapseProps } from "antd";
import TaskItem from "@/components/task/all/TaskItem";

const Span: React.FC<{ text: string; count: number }> = ({ text, count }) => (
  <>
    <span className="text-xs text-slate-950 font-bold font-sans -ml-2">
      {text}
    </span>
    <span className="ml-2 text-gray-400">{count}</span>
  </>
);

const All: React.FC = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [textValue, setTextValue] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(
    "none"
  );
  const text = `
  A dog is a type of domesticated animal.
`;

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <Span text="已过期" count={3} />,
      children: (
        <div>
          <TaskItem
            id="1"
            title="📊 看板、时间线视图：可视化管理"
            date="2024/12/30"
            tags={["生日", "生活"]}
            priority="high"
            checked={false}
            hasAttachment={true}
            hasContent={true}
            hasReminder={true}
            hasRepeat={true}
          />
          <TaskItem
            id="2"
            title="📝 购物清单"
            priority="medium"
            date="2025/1/7"
            tags={["生活"]}
          />
          <TaskItem id="3" priority="medium" date="2025/1/7" tags={["生活"]} />
        </div>
      ),
      extra: <span className="text-blue-500 text-xs cursor-pointer">顺延</span>,
    },
    {
      key: "2",
      label: <Span text="更远" count={1} />,
      children: <p>未来任务示例</p>,
    },
    {
      key: "3",
      label: <Span text="无日期" count={10} />,
      children: <p>无日期任务示例</p>,
    },
    {
      key: "4",
      label: <Span text="笔记" count={1} />,
      children: <p>笔记内容示例</p>,
    },
    {
      key: "5",
      label: <Span text="已完成" count={3} />,
      children: <p>已完成任务示例</p>,
    },
  ];
  const handleInputClick = () => {
    setIsInputVisible(true);
  };

  const handleInputBlur = () => {
    setIsInputVisible(false);
  };

  const handleTextChange = (newValue: string) => {
    setTextValue(newValue);
    console.log(textValue);
  };

  const handlePriorityChange = (newPriority: string, lable: string) => {
    setSelectedPriority(newPriority);
    setTextValue((prevText) => {
      const priorityRegex = /\[.*?\]/;
      const existingPriorityMatch = prevText.match(priorityRegex);
      if (existingPriorityMatch) {
        return prevText.replace(existingPriorityMatch[0], `[${lable}]`);
      } else {
        return `${prevText}[${lable}]`;
      }
    });
  };

  return (
    <div className="container -mt-3 px-4">
      {/* 输入区域 */}
      {!isInputVisible && !textValue && (
        <Input
          placeholder="+ 添加任务至收集箱"
          variant="filled"
          onFocus={handleInputClick}
        />
      )}
      {(isInputVisible || textValue) && (
        <TextInput
          value={textValue}
          selected={selectedPriority}
          onBlur={handleInputBlur}
          onChange={handleTextChange}
          onPriorityChange={handlePriorityChange}
        />
      )}
      <div>
        <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
          <Collapse
            defaultActiveKey={["1"]}
            ghost
            size="small"
            items={items}
            className="bg-white text-left p-2 ml-2"
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default All;
