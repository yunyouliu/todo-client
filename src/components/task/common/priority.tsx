/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-07 10:07:24
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-21 19:53:06
 */
import React from "react";
import SelectableItem from "@/components/task/common/SelectableItem";
const options = [
  { key: 1, label: "高优先级", icon: "red", value: 3 },
  { key: 2, label: "中优先级", icon: "yellow", value: 2 },
  { key: 3, label: "低优先级", icon: "blue", value: 1 },
  { key: 4, label: "无优先级", icon: "none", value: 0 },
];

interface PriorityProps {
  selected?: number | null;
  setSelected: (value: number, lable: string) => void;
}

const Priority: React.FC<PriorityProps> = ({ selected = 0, setSelected }) => {
  // 处理选项点击事件
  const handleClick = (optionValue: number, optionLabel: string) => {
    setSelected(optionValue, optionLabel);
  };

  return (
    <div className=" rounded-md p-1 ">
      {options.map((option) => (
        <SelectableItem
        classname="ml-10"
          key={option.value}
          option={option}
          selected={selected === option.value}
          onSelect={() => handleClick(option.value, option.label)}
        />
      ))}
    </div>
  );
};
export default Priority;
