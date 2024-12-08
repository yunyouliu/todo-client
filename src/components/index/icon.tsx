/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2024-11-21 13:58:13
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-11-25 18:11:43
 */
import React from "react";

interface IconProps {
  name: string; // `#icon-` 的后缀，例如 `home`
  className?: string; // Tailwind 样式类
  onClick?: React.MouseEventHandler<SVGSVGElement>; // 点击事件
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, className = "", onClick }, ref) => {
    return (
      <svg
        ref={ref} // 透传 ref
        className={className}
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
