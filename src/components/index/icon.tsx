/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-21 13:58:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-31 09:48:31
 */
import React from "react";

interface IconProps {
  name: string; // `#icon-` 的后缀，例如 `home`
  className?: string; // Tailwind 样式类
  size?: number; // 图标大小
  onClick?: React.MouseEventHandler<SVGSVGElement>; // 点击事件
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size, className = "", onClick }, ref) => {
    return (
      <svg
        className={`${className} ${size ? `` : "icon"}`}
        width={size}
        height={size}
        aria-hidden="true"
        onClick={onClick}
      >
        <use xlinkHref={`#icon-${name}`} />
      </svg>
    );
  }
);

Icon.displayName = "Icon"; // 为了在调试工具中有正确的组件名显示
export default Icon;
