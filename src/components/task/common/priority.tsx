/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-07 10:07:24
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-19 15:11:04
 */
import React from "react";
import Icon from "@/components/index/icon";
const options = [
  { label: "高优先级", color: "red", value: "high" },
  { label: "中优先级", color: "yellow", value: "medium" },
  { label: "低优先级", color: "blue", value: "low" },
  { label: "无优先级", color: "none", value: "none" },
];

interface PriorityProps {
  selected?: string | null;
  setSelected: (value: string, lable: string) => void;
}

const Priority: React.FC<PriorityProps> = ({
  selected = "无优先级",
  setSelected,
}) => {
  // 处理选项点击事件
  const handleClick = (optionValue: string, optionLabel: string) => {
    setSelected(optionValue, optionLabel);
  };

  return (
    <div className=" rounded-md p-1 ">
      {options.map((option) => (
        <div
          key={option.value}
          className="flex text-left cursor-pointer rounded-lg p-2 hover:bg-gray-100"
          onClick={() => handleClick(option.value, option.label)}
        >
          <Icon name={option.color} size={20} />
          <span
            className={`ml-2 ${
              selected === option.value
                ? "font-semibold text-blue-500"
                : "text-gray-600"
            }`}
          >
            {option.label}
          </span>
          {selected === option.value && (
            // <Icon name="dui" size={20} className="ml-3 text-blue-500  hover:bg-gray-500" />
            <span className=" text-blue-500 ml-12">√</span>
          )}
        </div>
      ))}
    </div>
  );
};
export default Priority;
