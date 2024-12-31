/*
 * @Descripttion:
 * @version: 1.0.1
 * @Author: yunyouliu
 * @Date: 2024-12-23 11:41:43
 * @LastEditors: yunyouliu
 * @LastEditTime: 2024-12-26 09:41:37
 */
import React, { useState, useRef, useEffect } from "react";
import { Progress, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

interface TimerProps {
  initialTime: number; // 初始倒计时时间，单位为秒
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime); // 动态倒计时
  const [isRunning, setIsRunning] = useState(false); // 是否正在运行
  const [startTime, setStartTime] = useState(""); // 开始时间
  const [endTime, setEndTime] = useState(""); // 结束时间
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const status = !isRunning && !startTime;

  // 计算进度条的百分比
  const progressPercent = ((initialTime - time) / initialTime) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeString = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // 启动或暂停计时器
  const handleStartPause = () => {
    if (isRunning) {
      // 暂停计时
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
    } else {
      // 设置开始和结束时间
      if (!startTime) {
        const now = new Date();
        setStartTime(getTimeString(now));
        const end = new Date(now.getTime() + time * 1000);
        setEndTime(getTimeString(end));
      }

      // 开始计时
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 0.1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            intervalRef.current = null;
            alert("时间到！");
            handleReset();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  // 重置计时器
  const handleReset = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setTime(initialTime);
    setStartTime("");
    setEndTime("");
    setIsRunning(false);
  };

  const handleAdjustTime = (adjustment: number) => {
    const newTime = time + adjustment;
    if (newTime > 0) {
      setTime(newTime);
      if (startTime) {
        const now = new Date();
        const end = new Date(now.getTime() + newTime * 1000);
        setEndTime(getTimeString(end));
      }
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, []);

  return (
    <div className="flex flex-col m-auto items-center justify-center">
      <h2 className="text-sm mb-10 text-gray-400 hover:text-gray-500 cursor-pointer">
        专注&nbsp;&gt;
      </h2>
      <div className="relative w-[300px] h-[300px] flex items-center justify-center group">
        <Progress
          type="circle"
          percent={progressPercent}
          format={() => (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-4">
                <MinusOutlined
                  onClick={() => handleAdjustTime(-300)}
                  className={`text-blue-500 mt-6 invisible ${isRunning ? "group-hover:visible" : ""}`}
                  style={{ fontSize: "22px" }}
                />
                <span className="text-4xl mt-4 text-gray-950">
                  {formatTime(time)}
                </span>
                <PlusOutlined
                  className={`text-blue-500 mt-6 invisible ${isRunning ? "group-hover:visible" : ""}`}
                  onClick={() => handleAdjustTime(300)}
                  style={{ fontSize: "22px" }}
                />
              </div>
              {!isRunning && startTime && (
                <span className="text-lg text-gray-500 absolute top-3/4 transform -translate-y-1/2">
                  已暂停
                </span>
              )}
              <span
                className={`text-lg text-gray-500 invisible ${isRunning ? "group-hover:visible" : ""}`}
              >
                {startTime} - {endTime}
              </span>
            </div>
          )}
          size={260}
          strokeWidth={2}
        />
      </div>
      <div className="mt-12 flex flex-col items-center justify-center gap-4">
        {status ? (
          <Button
            type="primary"
            onClick={handleStartPause}
            className="min-w-[80px] rounded-full h-12 w-36"
          >
            开始
          </Button>
        ) : isRunning ? (
          <Button
            type="default"
            onClick={handleStartPause}
            className="min-w-[80px] rounded-full h-12 w-36"
          >
            暂停
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              onClick={handleStartPause}
              className="min-w-[80px] rounded-full h-12 w-36"
            >
              继续专注
            </Button>
            <Button
              onClick={handleReset}
              className="min-w-[80px] rounded-full h-12 w-36"
            >
              结束
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
