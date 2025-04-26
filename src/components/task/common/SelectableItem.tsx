import React from "react";
import Icon from "@/components/index/icon";

interface Option {
  key: string | number;
  label: React.ReactNode |string;
  value?: string | number;
  icon?: string; // 用于图标名
}

interface SelectableItemProps {
  classname?: string;
  option: Option;
  selected: boolean;
  fontSize?: string;
  onSelect: (option: Option) => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({
  classname,
  option,
  selected,
  onSelect,
  fontSize,
}) => {
  return (
    <div
      key={option.key}
      className="flex items-center text-left cursor-pointer rounded-lg p-2 hover:bg-gray-100 select-none"
      onClick={() => onSelect(option)}
    >
      {option.icon && <Icon name={option.icon} size={20} />}
      <span
        className={`ml-2 ${"text-" + fontSize} ${
          selected ? "font-semibold text-blue-500" : "text-gray-600"
        }`}
      >
        {option.label}
      </span>
      {selected && (
        <span className={`text-blue-500 ${classname}`}>√</span>
        // <Icon name="dui" size={20} className="ml-auto text-blue-500" />
      )}
    </div>
  );
};

export default SelectableItem;
