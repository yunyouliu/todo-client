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
import { useSelector, useDispatch } from "umi";
import { debounce } from "lodash";
import { ITask } from "@/lib/db/database";
import Remind from "@/components/task/common/Remind";
import dayjs from "dayjs";
import List from "@/components/task/common/List";

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

const getTaskIdFromPath = (pathname: string): string | null => {
  // 分割路径并过滤空值
  const parts = pathname.split("/").filter(Boolean);
  // ['task', 'p', '67fc8595...', 'task', '12345']

  // 规则1：排除纯项目路径 /task/p/... 或 /task/t/...
  if (parts.length === 3 && (parts[1] === "p" || parts[1] === "t")) {
    return null; // 不提取项目ID
  }

  // 规则2：处理嵌套任务路径 /task/p/.../task/...
  if (parts.length >= 5 && parts[3] === "task") {
    return parts[4]; // 返回最后一段作为任务ID
  }

  // 规则3：普通任务路径 /task/[type]/...
  if (parts.length >= 3) {
    return parts[2]; // 返回第三段作为ID
  }

  return null;
};
const Detail: React.FC = () => {
  const location = useLocation();
  // 在组件顶部添加状态管理
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  );
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.task);
  const [filteredTask, setFilteredTask] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [PopoverVisible, setPopoverVisible] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectVisible, setProjectVisible] = useState(false);

  // 获取任务ID（必须放在所有hooks之后）
  const taskId = useMemo(() => {
    return getTaskIdFromPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch({ type: "task/loadTasks" });
    } else {
      const task = tasks.find((t: ITask) => t._id === taskId) || null;
      setFilteredTask(task);
      setSelectedDate(task?.dueDate || dayjs().format("YYYY-MM-DD HH:mm:ss"));
      setProjectId(task?.projectId || null); // 设置项目ID
    }
  }, [tasks, taskId, dispatch]);

  useEffect(() => {
    setTitle(filteredTask?.title || "无标题");
  }, [filteredTask, taskId]);
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
        id: taskId,
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
        id: taskId,
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
            id: taskId,
            changes: { title: newTitle },
          },
        });
      }, 500),
    [taskId, dispatch] // 依赖变化时重建
  );

  const handleSelected = (value: number, label: string) => {
    dispatch({
      type: "task/updateTask",
      payload: {
        id: taskId,
        changes: {
          priority: value,
        },
      },
    });
  };

  const allProjects = useSelector((state: any) => state.project.projects);

  const projectName = useMemo(() => {
    if (!projectId) return null;
    const p = allProjects.find((p: any) => p._id === projectId);
    return p?.name || null;
  }, [projectId, allProjects]);

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
  // 将条件判断移到hooks之后
  if (!taskId) return null;
  if (!filteredTask) {
    return <></>; // 添加加载状态提示
  }

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
            <Popover
              open={PopoverVisible}
              onOpenChange={(visible) => {
                setPopoverVisible(visible);
              }}
              trigger="click"
              placement="bottom"
              arrow={false}
              overlayInnerStyle={{ padding: 1 }}
              content={
                <Remind
                  initDate={filteredTask?.dueDate}
                  onSelect={(data) => {
                    // 更新任务数据
                    dispatch({
                      type: "task/updateTask",
                      payload: {
                        id: taskId,
                        changes: {
                          dueDate: data.remindTime,
                          isAllDay: data.isAllDay,
                          repeatRule: data.repeatRule,
                        },
                      },
                    });
                    setSelectedDate(data.remindTime); // 更新本地状态
                    setPopoverVisible(false); // 关闭弹出框
                  }}
                />
              }
            >
              <div className="flex items-center gap-1 select-none hover:bg-gray-100 rounded-sm p-1 relative before:content-[''] before:block before:w-[1px] before:h-4 before:bg-gray-300 before:absolute before:-left-1.5">
                <div className="flex items-center rounded-sm cursor-pointer">
                  <Icon name="rili" size={25} />
                </div>
                {formatRelativeDate(selectedDate) && (
                  <span
                    className={`text-sm ${formatRelativeDate(selectedDate)?.color === "red" ? "text-red-500" : "text-blue-500"}`}
                  >
                    {formatRelativeDate(selectedDate)?.label}
                  </span>
                )}
              </div>
            </Popover>
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
            <CrepeEditor key={taskId} />
          </MilkdownProvider>
        </div>

        {/* 标签区 */}
        <div className=""></div>
      </main>
      {/* 固定底部 */}
      <footer className="h-12 sticky bottom-0 z-10 flex items-center px-4 select-none">
        <div className="flex space-x-3">
          <Popover
            open={projectVisible}
            overlayInnerStyle={{ padding: 1 }}
            onOpenChange={(visible) => {
              setProjectVisible(visible);
            }}
            content={
              <List
                selectedProjectId={projectId || ""}
                onProjectSelect={({ id, name }) => {
                  setProjectId(id); // 设置项目ID
                  dispatch({
                    type: "task/updateTask",
                    payload: {
                      id: taskId,
                      changes: {
                        projectId: id,
                      },
                    },
                  });
                  setProjectVisible(false); // 关闭弹出框
                }}
              />
            }
            trigger="click"
            placement="top"
            arrow={false}
          >
            <div>
              {projectName ? (
                <span className="text-sm  rounded p-1 hover:bg-gray-100 mr-1">
                  {projectName}
                </span>
              ) : (
                <span className=" flex cursor-pointer  rounded-lg hover:bg-slate-100 p-0.5">
                  <Icon name="move" size={25} />
                  收集箱
                </span>
              )}
            </div>
          </Popover>
        </div>
      </footer>
    </div>
  );
};

export default Detail;
