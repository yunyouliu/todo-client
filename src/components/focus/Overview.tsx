import React from "react";
import { Typography } from "antd";

const Overview: React.FC = () => {
  const stats = [
    { title: "今日番茄", value: 0, unit: "" },
    { title: "今日专注时长", value: 0, unit: "s" },
    { title: "总番茄", value: 5, unit: "" },
    { title: "总专注时长", value: 6060, unit: "s" },
  ];

  const { Text } = Typography;

  const formatTime = (value: number, unit: string) => {
    let seconds = unit === "s" ? value : unit === "m" ? value * 60 : value;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    return (
      <>
        {hours > 0 && (
          <span>
            {hours}
            <span className="text-sm font-bold tracking-tighter">
              h
            </span>
          </span>
        )}
        {minutes > 0 && (
          <span>
            {hours > 0 && " "}
            {minutes}
            <span className="text-sm font-bold">
              m
            </span>
          </span>
        )}
        {hours === 0 && minutes === 0 && (
          <span>
            0
            <span className="text-sm font-bold">m</span>
          </span>
        )}
      </>
    );
  };

  return (
    <div className="text-left py-2 px-2">
      <Text className="text-lg">概览</Text>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col h-[73px] bg-gray-50 p-2 rounded-lg shadow"
          >
            <h3 className="text-xs text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold">
              {/* 判断是否需要格式化时间 */}
              {stat.unit === "s" || stat.unit === "m"
                ? formatTime(stat.value, stat.unit)
                : stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
