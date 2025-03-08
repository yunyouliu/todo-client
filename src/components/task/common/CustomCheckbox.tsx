import React from "react";
import { Checkbox, ConfigProvider } from "antd";
import type { CheckboxProps } from "antd";

interface CustomCheckboxProps extends CheckboxProps {
  color?: string; // 允许自定义颜色
  borderColor?: string; // 自定义边框颜色
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ color, borderColor, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color || "#1677ff", // 勾选颜色
          colorBorder: borderColor || "#d9d9d9", // 边框颜色
        },
      }}
    >
      <Checkbox {...props} />
    </ConfigProvider>
  );
};

export default CustomCheckbox;
