import React from "react";
import { Input } from "antd";
import Icon from "@/components/index/icon";

const List: React.FC = () => {
  const [value, setValue] = React.useState("6666");
  return (
    <div className=" flex w-full">
      <Input
        addonBefore={<Icon name="ss" />}
        placeholder="搜索"
        variant="borderless"
        value={value}
      />
    </div>
  );
};

export default List;
