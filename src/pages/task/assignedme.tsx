import React from "react";
import { Empty } from "antd";
import svgUrl from "@/assets/流程2.svg";

const Assignedme: React.FC = () => {
  return (
    <div className="w-full h-full flex justify-center items-center mt-40">
      <Empty
        description={
          <div>
            <div className="text-black">没有分配给我的任务</div>
            <div className="text-gray-400 text-xs">那就忙里偷个闲吧：D</div>
          </div>
        }
        image={<img src={svgUrl} alt="流程" />}
      />
    </div>
  );
};

export default Assignedme;
