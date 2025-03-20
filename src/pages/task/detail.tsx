/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-09 20:49:07
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-21 00:19:45
 */
import { MilkdownProvider } from "@milkdown/react";
import CrepeEditor from "@/components/task/input/CrepeEditor";
import { useLocation } from "umi";
import CustomCheckbox from "@/components/task/common/CustomCheckbox";
import Icon from "@/components/index/icon";
import { useState } from "react";
import { formatRelativeDate } from "@/utils/getDateLabel";
import { Input, Progress, Tooltip } from "antd";

const Detail: React.FC = () => {
  const location = useLocation();
  // 在组件顶部添加状态管理
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<"none" | "low" | "medium" | "high">(
    "none"
  );
  const [progressPercent, setProgressPercent] = useState(10);

  // 处理点击事件
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const containerWidth = rect.width;
    const rawPercent = (clickPosition / containerWidth) * 100;
    // 特殊处理：如果点击非常靠左的位置，设置为 0%
    const finalPercent = rawPercent < 5 ? 0 : Math.round(rawPercent / 10) * 10;
    setProgressPercent(Math.min(Math.max(finalPercent, 0), 100));
  };
  
  const id = location.pathname.match(/\/task\/all\/(\d+)/)?.[1];
  if (!id) return null;
  return (
    <div className="w-full h-full flex flex-col text-left">
      {/* 固定顶部 */}

      <header className="h-8 sticky top-0 z-10 flex flex-col px-4  mt-4 ">
        {/* 主工具栏区域 */}
        <div className="flex-1 flex items-center justify-between h-full">
          {/* 左侧区域 */}
          <div className="flex items-center gap-4">
            <CustomCheckbox borderColor="#EF4444" color="#EF4444" />
            {/* 日期相关交互区域 */}
            <div className="flex items-center gap-1 hover:bg-gray-100 rounded-sm p-1 relative before:content-[''] before:block before:w-[1px] before:h-4 before:bg-gray-300 before:absolute before:-left-1.5">
              <div className="flex items-center rounded-sm cursor-pointer">
                <Icon
                  name="rili"
                  size={25}
                  onClick={() => {
                    /* 日期选择器逻辑 */
                  }}
                />
              </div>
              {formatRelativeDate(selectedDate) && (
                <span
                  className={`text-sm ${formatRelativeDate(selectedDate)?.color === "red" ? "text-red-500" : "text-blue-500"}`}
                >
                  {formatRelativeDate(selectedDate)?.label}
                </span>
              )}
            </div>
          </div>

          {/* 右侧优先级区域 */}
          <div className="flex items-center gap-2">
            <div
              className="p-1 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors"
              onClick={() => {
                const levels: ("none" | "low" | "medium" | "high")[] = [
                  "none",
                  "low",
                  "medium",
                  "high",
                ];
                setPriority((prev) => levels[(levels.indexOf(prev) + 1) % 4]);
              }}
            >
              <Icon name={priority} size={25} />
            </div>
          </div>
        </div>
        {/* <div className="w-full h-px">
          <Progress
            percent={60}
            showInfo={false}
            strokeWidth={20}
            strokeColor="#1890ff" //蓝色
            trailColor="rgba(0, 0, 0, 0.06)"
            className="!m-0 progress-divider"
          />
        </div> */}
        {/* 进度条分割线 */}
        <Tooltip
          title={`${progressPercent}%`}
          overlayClassName="progress-tooltip"
          mouseEnterDelay={0.3}
          arrow={false}
          placement="bottom"
        >
          <div
            className="w-full h-px cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeWidth={1}
              strokeColor="#1298EB" //蓝色
              trailColor="#f0f0f0"
              className="!m-0 progress-divider"
            />

            {/* 点击热区指示器 */}
            <div className="absolute inset-0 z-10 opacity-0 hover:opacity-20 hover:bg-gray-200 transition-opacity" />
          </div>
        </Tooltip>
        <div className="mt-6">
          <Input placeholder="准备做什么" variant="borderless" className="text-xl font-bold"/>
        </div>
      </header>

      {/* 可滚动内容区域 */}
      <main className="flex-1 overflow-y-auto pt-4 pb-12">
        <div className="">
          <MilkdownProvider>
            <CrepeEditor onSave={() => {}} />
          </MilkdownProvider>
        </div>

        {/* 标签区 */}
        <div className=""></div>
      </main>
      {/* 固定底部 */}
      <footer className="h-12 bg-pink-200 sticky bottom-0 z-10 flex items-center px-4">
        <div className="flex space-x-4">{/* 这里可以添加底部操作按钮 */}</div>
      </footer>
    </div>
  );
};

export default Detail;
