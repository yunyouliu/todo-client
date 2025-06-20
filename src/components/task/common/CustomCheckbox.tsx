import React from "react";
import { Checkbox, ConfigProvider } from "antd";
import type { CheckboxProps } from "antd";

interface CustomCheckboxProps extends CheckboxProps {
  color?: string; // 允许自定义颜色
  borderColor?: string; // 允许自定义边框颜色
  checked?: boolean; // 是否选中
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void; // 点击事件
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  color,
  borderColor,
  checked,
  onClick,
  ...props
}) => {
  // 根据 Ant Design 版本选择正确的主题变量名称
  const themeVariable = {
    primaryColor: color || "#1677ff", // 勾选颜色
    colorBorder: borderColor || "#d9d9d9", // 边框颜色
  };

  return (
    <ConfigProvider theme={{ token: themeVariable }}>
      <Checkbox {...props} checked={checked} onClick={onClick} />
    </ConfigProvider>
  );
};

interface PriorityCheckboxProps {
  priority: number;
  checked: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface PriorityColors {
  color: string;
  borderColor: string;
}

export const PriorityCheckbox: React.FC<PriorityCheckboxProps> = ({
  priority,
  checked,
  onClick,
}) => {
  const priorityColors = new Map([
    [0, { color: "#d9d9d9", borderColor: "#d9d9d9" }],
    [1, { color: "#1590EE", borderColor: "#1590EE" }],
    [2, { color: "#faad14", borderColor: "#faad14" }],
    [3, { color: "#ff4d4f", borderColor: "#ff4d4f" }],
  ]);

  // 已完成状态下的样式
  const completedStyle: PriorityColors = checked
    ? {
        color: "#a3a3a3",
        borderColor: "#a3a3a3",
      }
    : priorityColors.get(priority) || { color: "#000", borderColor: "#000" };

  return (
    <CustomCheckbox
      checked={checked}
      color={completedStyle.color}
      borderColor={completedStyle.borderColor}
      onClick={onClick}
    />
  );
};
