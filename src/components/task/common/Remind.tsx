/*
 * @Descripttion: 设置提醒时间
 * @version: 1.0.1
 * @Author: yunyouliu
 * @Date: 2025-01-07 20:04:27
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-04-23 16:00:00
 */
import React, { useState, useMemo, useEffect } from "react";
import { Segmented, Tooltip, Popover, Button, Switch } from "antd";
import Icon from "@/components/index/icon";
import { Calendar, TimePicker, DatePicker, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { RightOutlined } from "@ant-design/icons";
import SelectableItem from "./SelectableItem";
const { RangePicker } = DatePicker;

type TimeMode = "日期" | "时间段";
export type RepeatType = "daily" | "weekly" | "monthly" | "yearly" | null;
export type RepeatRule = {
  type: RepeatType;
  until?: string; // 重复结束时间（ISO格式）
};

type RemindProps = {
  onSelect: (data: {
    remindTime: string;
    timeRange?: [Dayjs, Dayjs] | null;
    isAllDay?: boolean;
    repeatRule?: RepeatRule;
  }) => void;
  initDate: string;
};

const DATE_ACTIONS = [
  { name: "今天", icon: "day", offset: 0, unit: "day" },
  { name: "明天", icon: "mingtian", offset: 1, unit: "day" },
  { name: "下周", icon: "week", offset: 1, unit: "week" },
  { name: "下月", icon: "night", offset: 1, unit: "month" },
];

const REMIND_OPTIONS = [
  { key: 1, label: "准时", offset: 0, unit: "minute" },
  { key: 2, label: "提前30分钟", offset: 30, unit: "minute" },
  { key: 3, label: "提前1小时", offset: 1, unit: "hour" },
  { key: 4, label: "提前1天", offset: 1, unit: "day" },
];

const Remind: React.FC<RemindProps> = ({ onSelect, initDate }) => {
  const initialDate = useMemo(() => dayjs(initDate), [initDate]);
  const [timeMode, setTimeMode] = useState<TimeMode>("日期");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(initialDate);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [repeatVisible, setRepeatVisible] = useState(false);
  const [reminderSetting, setReminderSetting] = useState(REMIND_OPTIONS[0]);
  const [repeatSetting, setRepeatSetting] = useState<RepeatType>(null);
  const [repeatRule, setRepeatRule] = useState<RepeatRule>({ type: null });

  const [messageApi, contextHolder] = message.useMessage();
  //快速日期基于当前选中日期计算偏移
  const handleQuickDate = (action: () => Dayjs) => {
    const newDate = action()
      .set("hour", selectedDate?.hour() || 0)
      .set("minute", selectedDate?.minute() || 0);
    setSelectedDate(newDate);
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "请先选择时间",
    });
  };

  // 正确处理提醒选择
  const handleReminderSelect = (option: (typeof REMIND_OPTIONS)[0]) => {
    if (selectedTime || timeMode === "时间段") {
      setReminderSetting(option);
    }
    setReminderVisible(false);
  };

  // 完善：重复设置增加结束时间计算
  const handleRepeatSelect = (type: RepeatType) => {
    if (repeatSetting === type) {
      // 如果选择的是当前重复类型，则取消选择
      setRepeatSetting(null);
      setRepeatRule({ type: null });
    } else {
      // 根据重复类型计算重复结束时间
      const untilDate =
        type !== null
          ? dayjs(selectedDate).add(
              1,
              type === "daily"
                ? "year"
                : type === "weekly"
                ? "week"
                : type === "monthly"
                ? "month"
                : "year"
            )
          : null;

      // 设置重复类型
      setRepeatSetting(type);
      // 设置重复规则，包括类型和结束时间
      setRepeatRule({ type, until: untilDate?.toISOString() });
    }
    // 隐藏重复设置弹窗
    setRepeatVisible(false);
  };

  useEffect(() => {
    console.log("initialDate改变了", initialDate);
    //提取initialDate的hhmm同步到selectedTime
    if (initialDate) {
      const hour = initialDate.hour();
      const minute = initialDate.minute();
      if (
        ((hour === 0 || hour === 9) && minute === 0) ||
        isNaN(hour) ||
        isNaN(minute)
      ) {
        setSelectedTime(null);
      } else {
        setSelectedTime(dayjs().set("hour", hour).set("minute", minute));
      }
    }
    console.log("selectedTime", selectedTime);
  }, [initialDate]);

  // 时间选择处理
  const handleTimeChange = (time: Dayjs | null) => {
    if (!time) {
      setSelectedTime(null);
      return;
    }
    setSelectedTime(time);
  };

  // 时间段变化处理
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setTimeRange([dates[0], dates[1]]);
    } else {
      setTimeRange(null);
    }
  };

  //全天模式切换时保持日期一致性
  const handleAllDayChange = (checked: boolean) => {
    setIsAllDay(checked);
  };

  const handleConfirm = () => {
    if (!selectedDate && timeMode === "日期") return;
    const baseData = {
      isAllDay,
      repeatRule: repeatRule.type ? repeatRule : undefined,
    };
    console.log("baseData", baseData);

    if (timeMode === "日期") {
      const remindedDate = selectedDate
        ? selectedDate
            .set("hour", selectedTime?.hour() || selectedDate.hour())
            .set("minute", selectedTime?.minute() || selectedDate.minute())
            .subtract(
              reminderSetting.offset,
              reminderSetting.unit as dayjs.ManipulateType
            )
        : dayjs();

      onSelect({
        remindTime: isAllDay
          ? remindedDate.format("YYYY-MM-DD")
          : remindedDate.toISOString(),
        ...baseData,
      });
    } else {
      onSelect({
        remindTime: timeRange ? timeRange[0].toISOString() : "",
        timeRange: timeRange ? [timeRange[0], timeRange[1]] : undefined,
        ...baseData,
      });
    }
  };

  //清除时重置所有相关状态
  const handleReset = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setTimeRange(null);
    setReminderSetting(REMIND_OPTIONS[0]);
    setRepeatSetting(null);
    setRepeatRule({ type: null });
    onSelect({
      remindTime: "",
      timeRange: undefined,
      isAllDay: undefined,
      repeatRule: undefined,
    });
  };

  // 修复：重复选项使用当前选中日期计算（避免闭包陷阱）
  const REPEAT_OPTIONS = useMemo(
    () => [
      { key: 1, label: "每天", type: "daily" },
      {
        key: 2,
        label: (
          <div>
            每周
            <span className="text-gray-400 ml-1">
              ({selectedDate?.format("ddd")})
            </span>
          </div>
        ),
        type: "weekly",
      },
      {
        key: 3,
        label: (
          <div>
            每月
            <span className="text-gray-400 ml-1">
              ({selectedDate?.date()}日)
            </span>
          </div>
        ),
        type: "monthly",
      },
      {
        key: 4,
        label: (
          <div>
            每年
            <span className="text-gray-400 ml-1">
              ({selectedDate?.format("M月D日")})
            </span>
          </div>
        ),
        type: "yearly",
      },
    ],
    [selectedDate]
  );

  return (
    <div className="w-72 p-2 bg-white rounded-lg shadow-lg">
      {contextHolder}
      <div className="text-center w-56 m-auto">
        <Segmented<TimeMode>
          value={timeMode}
          onChange={setTimeMode}
          options={["日期", "时间段"]}
          block
          className="mb-4"
        />
      </div>
      {timeMode === "日期" ? (
        <div className="w-full">
          <div className="gap-5 p-3 flex mt-1">
            {DATE_ACTIONS.map(({ name, icon, offset, unit }) => (
              <Tooltip title={name} placement="bottom" key={name}>
                <div
                  className="flex flex-col m-auto items-center rounded-lg justify-center hover:bg-gray-100"
                  onClick={() =>
                    handleQuickDate(() =>
                      dayjs(selectedDate).add(
                        offset,
                        unit as dayjs.ManipulateType
                      )
                    )
                  }
                >
                  <Icon name={icon} size={30} className="p-1" />
                </div>
              </Tooltip>
            ))}
          </div>
          <div className="flex">
            <Calendar
              fullscreen={false}
              value={selectedDate || undefined}
              onSelect={setSelectedDate}
            />
          </div>
          <div className="flex flex-col text-left p-2 w-full">
            <div
              key="1"
              className="flex items-center justify-between  rounded-lg cursor-pointer hover:bg-gray-100"
            >
              {/* 左侧图标和文字 */}
              <div className="flex items-center space-x-3">
                <Icon
                  name={`${selectedTime ? "time-copy" : "time"}`}
                  size={20}
                />
                <TimePicker
                  size="small"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  format="HH:mm"
                  allowClear
                  className="w-full"
                  placeholder="选择时间"
                  changeOnScroll
                />
              </div>
              {/* 右侧箭头 */}
              <RightOutlined className="text-xs text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-left p-2 text-xs w-full">
          <RangePicker
            showTime={!isAllDay}
            format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
            value={timeRange || undefined}
            onChange={handleRangeChange}
            className="w-full"
          />
          <div className="flex items-center p-2 mt-2 rounded-lg cursor-pointer ">
            <span className="float-left -ml-1">全天</span>
            <Switch
              className="ml-auto"
              size="small"
              checked={isAllDay}
              onChange={handleAllDayChange}
            />
          </div>
        </div>
      )}

      <Popover
        open={reminderVisible}
        onOpenChange={() => {
          if (!selectedTime && timeMode === "日期") {
            warning();
          } else {
            setReminderVisible(!reminderVisible);
          }
        }}
        trigger="click"
        className="w-full"
        content={
          <div className="w-64">
            {REMIND_OPTIONS.map((option) => (
              <SelectableItem
                classname="ml-auto"
                key={option.key}
                option={option}
                selected={reminderSetting.key === option.key}
                onSelect={() => handleReminderSelect(option)}
              />
            ))}
          </div>
        }
        placement="top"
        arrow={false}
      >
        <div
          key="2"
          className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          {/* 左侧图标和文字 */}
          <div className="flex items-center space-x-3">
            <Icon
              name={`${selectedTime || timeMode == "时间段" ? "clock-copy" : "clock"}`}
              size={20}
            />
            <span
              className={`text-xs ${selectedTime || timeMode == "时间段" ? "text-blue-500" : "text-gray-400"}`}
            >
              {selectedTime || timeMode == "时间段"
                ? reminderSetting.label
                : "提醒"}
            </span>
          </div>
          {/* 右侧箭头 */}
          <RightOutlined className="text-xs text-gray-400" />
        </div>
      </Popover>
      <Popover
        content={
          <div className="w-64">
            {REPEAT_OPTIONS.map((option) => (
              <SelectableItem
                classname="ml-auto"
                key={option.key}
                option={option}
                selected={repeatSetting === option.type}
                onSelect={() => handleRepeatSelect(option.type as RepeatType)}
              />
            ))}
          </div>
        }
        open={repeatVisible}
        onOpenChange={setRepeatVisible}
        trigger="click"
        arrow={false}
      >
        <div
          key="3"
          className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          {/* 左侧图标和文字 */}
          <div className="flex items-center space-x-3">
            <Icon
              name={`${repeatSetting ? "repeat-copy" : "repeat"}`}
              size={20}
            />
            <span
              className={`text-xs  ${repeatSetting ? "text-blue-500" : "text-gray-400"}`}
            >
              {repeatSetting
                ? REPEAT_OPTIONS.find((option) => option.type === repeatSetting)
                    ?.label
                : "重复"}
            </span>
          </div>
          {/* 右侧箭头 */}
          <RightOutlined className="text-xs text-gray-400" />
        </div>
      </Popover>
      {/* 底部按钮 */}
      <div className="flex justify-between mt-4 gap-2">
        <Button block onClick={handleReset}>
          清除
        </Button>
        <Button type="primary" block onClick={handleConfirm}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default Remind;
