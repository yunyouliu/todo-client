/*
 * @Descripttion:设置提醒时间
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-07 20:04:27
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-08 13:34:48
 */
import React, { useState } from "react";
import { Segmented, Tooltip } from "antd";
import Icon from "@/components/index/icon";
import { Calendar, theme, Button } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs"; // 使用 dayjs 库来处理日期

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

const Icons = [
  {
    name: "今天",
    IconName: "day",
    action: () => dayjs(), // 今天
  },
  {
    name: "明天",
    IconName: "mingtian",
    action: () => dayjs().add(1, "day"), // 明天
  },
  {
    name: "下周",
    IconName: "week",
    action: () => dayjs().add(1, "week"), // 下周
  },
  {
    name: "下月",
    IconName: "night",
    action: () => dayjs().add(1, "month"), // 下月
  },
];

const bottomIcon = [
  {
    name: "时间",
    IconName: "time",
  },
  {
    name: "提醒",
    IconName: "clock",
  },
  {
    name: "重复",
    IconName: "repeat",
  },
];

const Remind: React.FC<{ onSelect: (date: string) => void }> = ({
  onSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const handleIconClick = (action: () => Dayjs) => {
    const newDate = action();
    setSelectedDate(newDate);
    onSelect(newDate.format("YYYY-MM-DD")); // 回调更新选中的日期
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    onSelect(date.format("YYYY-MM-DD")); // 回调更新日期
  };

  return (
    <div className="w-72 p-2 bg-white rounded-lg shadow-lg">
      <div className="text-center w-56 m-auto">
        <Segmented<string>
          defaultValue="日期"
          block
          className="items-center justify-center m-auto"
          options={["日期", "时间段"]}
          onChange={(value) => console.log(value)}
        />
      </div>
      <div className="gap-5 p-3 flex mt-1">
        {Icons.map((item) => (
          <Tooltip title={item.name} placement="bottom" key={item.name}>
            <div
              className="flex flex-col m-auto items-center rounded-lg justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleIconClick(item.action); // 点击时更新日期
              }}
            >
              <Icon name={item.IconName} size={30} className="p-1" />
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="flex">
        <Calendar
          fullscreen={false}
          value={selectedDate}
          onSelect={handleDateSelect} // 更新日期
        />
      </div>
      <div className="flex flex-col text-left p-2 w-full">
        {bottomIcon.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            {/* 左侧图标和文字 */}
            <div className="flex items-center space-x-3">
              <Icon name={item.IconName} size={20} />
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
            {/* 右侧箭头 */}
            <Icon name="right" size={16} className="text-gray-400" />
          </div>
        ))}
        {/* 底部按钮 */}
        <div className="flex justify-between mt-4 gap-2">
          <Button type="primary" className="w-full" size="middle">
            确定
          </Button>
          <Button className="w-full" size="middle">
            清除
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Remind;
