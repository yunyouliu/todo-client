/*
 * @Descripttion: 智能待办事项任务分类
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-01-04 20:02:11
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-12 18:40:27
 */
import React, { useState, useEffect } from "react";
import TextInput from "@/components/task/input/TextInput";
import { Input, Collapse, ConfigProvider } from "antd";
import type { CollapseProps } from "antd";
import TaskItem from "@/components/task/all/TaskItem";
import { ITask } from "@/lib/db/database";
import { useSelector, useDispatch } from "umi";

const Span: React.FC<{ text: string; count: number }> = ({ text, count }) =>
  count > 0 ? (
    <>
      <span className="text-xs text-slate-950 font-bold font-sans -ml-2">
        {text}
      </span>
      <span className="ml-2 text-gray-400">{count}</span>
    </>
  ) : null;

const renderTaskItems = (tasks: ITask[]) =>
  tasks.map((task) => (
    <TaskItem
      key={task._id}
      id={task._id}
      title={task.title}
      date={task.dueDate?.toLocaleDateString() || ""}
      tags={task.tags}
      priority={task.priority}
      checked={task.status === 2}
      hasAttachment={task.attachments?.length > 0}
      hasContent={!!task.content}
      hasReminder={task.reminders?.length > 0}
      hasRepeat={!!task.repeatFlag}
    />
  ));

const All: React.FC = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [textValue, setTextValue] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(
    "none"
  );
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.task);

  // 初始化加载数据
  useEffect(() => {
    dispatch({ type: "task/loadTasks" });
    dispatch({ type: "task/watchDBChanges" }); // 启动监听
  }, []);

  interface GroupedTasks {
    completed: ITask[];
    overdue: ITask[];
    upcoming: ITask[];
    noDate: ITask[];
  }

  const groupedTasks: GroupedTasks = {
    completed: tasks.filter((task: ITask) => task.status === 2), // 已完成优先
    overdue: tasks.filter(
      (task: ITask) =>
        task.status !== 2 && task.dueDate && new Date(task.dueDate) < new Date()
    ),
    upcoming: tasks.filter(
      (task: ITask) =>
        task.status !== 2 &&
        task.dueDate &&
        new Date(task.dueDate) >= new Date()
    ),
    noDate: tasks.filter((task: ITask) => task.status !== 2 && !task.dueDate),
  };

  // 任务折叠面板
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <Span text="已过期" count={groupedTasks.overdue.length} />,
      children: renderTaskItems(groupedTasks.overdue),
      extra: <span className="text-blue-500 text-xs cursor-pointer">顺延</span>,
    },
    {
      key: "2",
      label: <Span text="更远" count={groupedTasks.upcoming.length} />,
      children: renderTaskItems(groupedTasks.upcoming),
    },
    {
      key: "3",
      label: <Span text="无日期" count={groupedTasks.noDate.length} />,
      children: renderTaskItems(groupedTasks.noDate),
    },
    {
      key: "4",
      label: <Span text="已完成" count={groupedTasks.completed.length} />,
      children: renderTaskItems(groupedTasks.completed),
    },
  ].filter((item) => item.children.length > 0); // 过滤掉没有任务的分类

  return (
    <div className="container -mt-3 px-4">
      {/* 输入区域 */}
      {!isInputVisible && !textValue && (
        <Input
          placeholder="+ 添加任务至收集箱"
          variant="filled"
          onFocus={() => setIsInputVisible(true)}
        />
      )}
      {(isInputVisible || textValue) && (
        <TextInput
          value={textValue}
          selected={selectedPriority}
          onBlur={() => setIsInputVisible(false)}
          onChange={(newValue) => setTextValue(newValue)}
          onPriorityChange={(newPriority, label) => {
            setSelectedPriority(newPriority);
            setTextValue((prevText) => {
              const priorityRegex = /\[.*?\]/;
              const existingPriorityMatch = prevText.match(priorityRegex);
              return existingPriorityMatch
                ? prevText.replace(existingPriorityMatch[0], `[${label}]`)
                : `${prevText}[${label}]`;
            });
          }}
        />
      )}
      <div>
        <ConfigProvider theme={{ token: { paddingSM: 0, paddingLG: 0 } }}>
          <Collapse
            defaultActiveKey={["1"]}
            ghost
            size="small"
            items={items}
            className="bg-white text-left p-2 ml-2"
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default All;
