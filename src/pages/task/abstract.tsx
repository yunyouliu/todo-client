/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-02-21 16:01:56
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-02-28 18:58:34
 */
import React, { useEffect, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";

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
      height: "600px",
      width: "90%",
    });
    // Clear the effect
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, []);
  return (
    <div className="flex h-full w-full p-6">
      <div id="vditor" className="vditor text-left flex"></div>
    </div>
  );
};

export default Abstract;
