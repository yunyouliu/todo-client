/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-07 20:04:27
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-01-08 11:19:10
 */
import React from "react";
import { Segmented, Tooltip } from "antd";
import Icon from "@/components/index/icon";

// const Icons = ["day", "mingtian", "week", "night"];
const Icons = [
  {
    name: "今天",
    IconName: "day",
  },
  {
    name: "明天",
    IconName: "mingtian",
  },
  {
    name: "下周",
    IconName: "week",
  },
  {
    name: "下月",
    IconName: "night",
  },
];

const Remind: React.FC = () => {
  return (
    <div className="w-64 p-2">
      <div className="text-center w-56 m-auto">
        <Segmented<string>
          defaultValue="日期"
          block
          className="items-center justify-center m-auto"
          options={["日期", "时间段"]}
          onChange={(value) => {
            console.log(value); // string
          }}
        />
      </div>
      <div className=" gap-5 p-3 flex mt-1">
        {Icons.map((item) => (
          <Tooltip title={item.name} placement="bottom" key="more">
            <div className="flex flex-col m-auto items-center rounded-lg justify-center hover:bg-gray-100" onClick={(e)=>{
              e.preventDefault()
            }}>
              <Icon name={item.IconName} size={30} className="p-1" />
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Remind;
