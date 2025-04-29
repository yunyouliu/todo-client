/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-09 20:49:07
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-21 19:57:35
 */
import { MilkdownProvider } from "@milkdown/react";
import CrepeEditor from "@/components/task/input/CrepeEditor";
import { useLocation } from "umi";
import { PriorityCheckbox } from "@/components/task/common/CustomCheckbox";
import Icon from "@/components/index/icon";
import React, { useState, useEffect, useMemo } from "react";
import { formatRelativeDate } from "@/utils/getDateLabel";
import { Input, Progress, Tooltip, Popover } from "antd";
import Priority from "@/components/task/common/priority";
import { useSelector, useDispatch, useParams } from "umi";
import { debounce } from "lodash";
import { ITask } from "@/lib/db/database";

const getIconName = (priority: number): string => {
  switch (priority) {
    case 3:
      return "high";
    case 2:
      return "medium";
    case 1:
      return "low";
    default:
      return "none";
  }
};
const Detail: React.FC = () => {
  const location = useLocation();
  // 在组件顶部添加状态管理
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.task);
  const [filteredTask, setFilteredTask] = useState<any>(null);
  const [title, setTitle] = useState("");
  const { id } = useParams();

  useEffect(() => {
    // 精确筛选任务
    const task = tasks?.find((task: ITask) => task._id === id) || null;
    setFilteredTask(task);
  }, [tasks, id]);

  useEffect(() => {
    setTitle(filteredTask?.title || "无标题");
  }, [filteredTask, id]);
  // 处理点击事件
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const containerWidth = rect.width;
    const rawPercent = (clickPosition / containerWidth) * 100;
    // 特殊处理：如果点击非常靠左的位置，设置为 0%
    const finalPercent = rawPercent < 5 ? 0 : Math.round(rawPercent / 10) * 10;
    // setProgressPercent(Math.min(Math.max(finalPercent, 0), 100));
    dispatch({
      type: "task/updateTask",
      payload: {
        id,
        changes: {
          progress: finalPercent,
        },
      },
    });
  };

  const handStausChange = () => {
    dispatch({
      type: "task/updateTask",
      payload: {
        id,
        changes: {
          status: filteredTask.status === 0 ? 2 : 0,
        },
      },
    });
  };

  const debouncedUpdateTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        dispatch({
          type: "task/updateTask",
          payload: {
            id,
            changes: { title: newTitle },
          },
        });
      }, 500),
    [id, dispatch] // 依赖变化时重建
  );

  const handleSelected = (value: number, label: string) => {
    dispatch({
      type: "task/updateTask",
      payload: {
        id,
        changes: {
          priority: value,
        },
      },
    });
  };

  const handTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle); // 立即更新本地状态
    debouncedUpdateTitle(newTitle); // 触发防抖更新
  };

  // 组件卸载时取消未执行的防抖操作
  useEffect(() => {
    return () => {
      debouncedUpdateTitle.cancel();
    };
  }, [debouncedUpdateTitle]);

  const pathName = location.pathname.match(/\/task\/all\/(\d+)/)?.[1];
  if (!pathName) return null;
  return (
    <div className="w-full h-full flex flex-col text-left">
      {/* 固定顶部 */}

      <header className="h-8 sticky top-0 z-10 flex flex-col px-4  mt-4 ">
        {/* 主工具栏区域 */}
        <div className="flex-1 flex items-center justify-between h-full">
          {/* 左侧区域 */}
          <div className="flex items-center gap-4">
            <PriorityCheckbox
              checked={filteredTask?.status === 2}
              priority={filteredTask?.priority}
              onClick={handStausChange}
            />
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
            <Popover
              trigger="click"
              placement="bottom"
              arrow={false}
              overlayInnerStyle={{ padding: 1 }}
              content={
                <Priority
                  selected={filteredTask?.priority}
                  setSelected={handleSelected}
                />
              }
            >
              <div className="p-1 rounded-sm cursor-pointer transition-colors">
                <Icon name={getIconName(filteredTask?.priority)} size={25} />
              </div>
            </Popover>
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
          title={`${filteredTask?.progress || 0}%`}
          overlayClassName="progress-tooltip"
          mouseEnterDelay={0.3}
          arrow={false}
          placement="bottom"
        >
          <div
            className="w-full h-px cursor-pointer relative -mt-2"
            onClick={handleProgressClick}
          >
            <Progress
              percent={filteredTask?.progress || 0}
              showInfo={false}
              strokeColor="#1298EB" //蓝色
              trailColor="#f0f0f0"
              className="!m-0 progress-divider bg-white"
            />

            {/* 点击热区指示器 */}
            <div className="absolute inset-0 z-100 opacity-0 hover:opacity-20 hover:bg-gray-200 transition-opacity" />
          </div>
        </Tooltip>
      </header>

      {/* 可滚动内容区域 */}
      <main className="flex-1 overflow-y-auto pt-4 pb-12">
        <div className="">
          <Input
            type="text"
            placeholder="准备做什么"
            variant="borderless"
            className="text-xl font-bold"
            value={title}
            onChange={handTitleChange}
            onBlur={() => debouncedUpdateTitle.flush()}
          />
        </div>
        <div className="">
          <MilkdownProvider>
            <CrepeEditor key={id} />
          </MilkdownProvider>
        </div>

        {/* 标签区 */}
        <div className=""></div>
      </main>
      {/* 固定底部 */}
      <footer className="h-12  sticky bottom-0 z-10 flex items-center px-4">
        <div className="flex space-x-4">
          <span>
            
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Detail;
