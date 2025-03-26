import React from "react";
import { Popover, Badge, Avatar } from "antd";
import Icon from "@/components/index/icon";
import MenuItem from "@/components/task/common/MenuItem";

interface UserPopoverProps {
  avatar: string;
  size?: number;
  vip?: boolean;
  shape?: "circle" | "square";
}

const UserPopover: React.FC<UserPopoverProps> = ({
  avatar,
  size = 34,
  shape = "square",
  vip=false
}) => {
  return (
    <Popover
      placement="rightTop"
      trigger="click"
      arrow={false}
      overlayInnerStyle={{ padding: 0 }}
      content={
        <div className="w-40 p-1 shadow-lg">
          <MenuItem
            icon="shezhi"
            label="设置"
            size={20}
            onClick={() => console.log("点击了设置")}
          />
          <MenuItem
            icon="tongji"
            label="统计"
            size={17}
            onClick={() => console.log("点击了统计")}
          />
          <MenuItem
            icon="vip1"
            label="高级会员"
            size={18}
            onClick={() => console.log("点击了高级会员")}
          />
          <MenuItem
            icon="logout"
            label="退出登录"
            size={20}
            onClick={() => console.log("点击了退出登录")}
          />
        </div>
      }
    >
      <Badge
        count={<Icon name={`${vip?"vip":"normal"}`} size={13} className="z-20" />}
        offset={[-5, -5]}
      >
        <Avatar
          src={avatar}
          size={size}
          shape={shape}
          className="mb-4 cursor-pointer"
        />
      </Badge>
    </Popover>
  );
};

export default UserPopover;
