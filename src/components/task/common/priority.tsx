import React from "react";
import Icon from "@/components/index/icon";
const options = [
  { label: "高优先级", color: "red", value: "高优先级" },
  { label: "中优先级", color: "yellow", value: "中优先级" },
  { label: "低优先级", color: "blue", value: "低优先级" },
  { label: "无优先级", color: "youxianji", value: "无优先级" },
];

interface PriorityProps {
  selected?: string | null;
  setSelected?: (value: string) => void;
}

const Priority: React.FC<PriorityProps> = ({
  selected = "无优先级",
  setSelected,
}) => {
  return (
    <div className=" rounded-md p-1 ">
      {options.map((option) => (
        <div
          key={option.value}
          className="flex text-left cursor-pointer rounded-lg p-2 hover:bg-gray-100"
          onClick={() => setSelected && setSelected(option.value)}
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
