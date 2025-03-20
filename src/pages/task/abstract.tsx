/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-02-21 16:01:56
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-10 18:26:45
 */
import React, { useEffect, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { Select } from "antd";

const Abstract: React.FC = () => {
  const [vd, setVd] = useState<Vditor>();
  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue(`# 2月23日-3月1日
当前范围内没有符合条件的任务
          `);
        setVd(vditor);
      },
      minHeight: 600,
      width: "100%",
    });
    // Clear the effect
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, []);
  return (
    <div className="flex flex-col h-full w-full p-3">
      <div className="flex -mt-4 justify-start gap-4 text-xs">
        <Select defaultValue="上月" size="small" className="text-xs" />
        <Select defaultValue="上月" size="small" />
        <Select defaultValue="上月" size="small" />
      </div>
      <div id="vditor" className="vditor text-left  mt-2 p-0" />
    </div>
  );
};

export default Abstract;
