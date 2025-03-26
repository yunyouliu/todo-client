import React from "react";
import { Checkbox, ConfigProvider } from "antd";
import type { CheckboxProps } from "antd";

interface CustomCheckboxProps extends CheckboxProps {
  color?: string; // 允许自定义颜色
  borderColor?: string; // 允许自定义边框颜色
  checked?: boolean; // 是否选中
  onClick?: () => void; // 点击事件
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  color,
  borderColor,
  checked,
  onClick,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color || "#1677ff", // 勾选颜色
          colorBorder: borderColor || "#d9d9d9", // 边框颜色
        },
      }}
    >
      <Checkbox {...props} checked={checked} onClick={onClick} />
    </ConfigProvider>
  );
};

export const PriorityCheckbox = ({
  priority,
  checked,
  onClick,
}: {
  priority: "none" | "low" | "medium" | "high";
  checked: boolean;
  onClick: () => void;
}) => {
  // 优先级颜色映射
  const priorityColors = {
    none: { color: "#d9d9d9", borderColor: "#d9d9d9" },
    low: { color: "#52c41a", borderColor: "#52c41a" },
    medium: { color: "#faad14", borderColor: "#faad14" },
    high: { color: "#ff4d4f", borderColor: "#ff4d4f" },
  };

  // 已完成状态下的样式
  const completedStyle = checked
    ? {
        color: "#a3a3a3",
        borderColor: "#a3a3a3",
        textDecoration: "line-through",
      }
    : priorityColors[priority];

  return (
    <CustomCheckbox
      checked={checked}
      color={completedStyle.color}
      borderColor={completedStyle.borderColor}
      onClick={onClick}
    />
  );
};
