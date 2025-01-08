/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-04 20:02:11
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-08 11:49:36
 */
import React, { useState } from "react";
import TextInput from "@/components/task/common/TextInput";
import { Input } from "antd";

const All: React.FC = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [textValue, setTextValue] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(
    "无优先级"
  );

  const handleInputClick = () => {
    setIsInputVisible(true);
  };

  const handleInputBlur = () => {
    setIsInputVisible(false);
  };

  const handleTextChange = (newValue: string) => {
    setTextValue(newValue);
  };

  const handlePriorityChange = (newPriority: string) => {
    setSelectedPriority(newPriority);
    if (newPriority === "无优先级") return;
    setTextValue((prevText) => {
      const priorityRegex = /\[.*?\]/;
      const existingPriorityMatch = prevText.match(priorityRegex);
      if (existingPriorityMatch) {
        return prevText.replace(existingPriorityMatch[0], `[${newPriority}]`);
      } else {
        return `${prevText}[${newPriority}]`;
      }
    });
  };

  return (
    <div className="container -mt-3 px-4">
      {/* 使用条件渲染确保逻辑清晰 */}
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
    </div>
  );
};

export default All;
