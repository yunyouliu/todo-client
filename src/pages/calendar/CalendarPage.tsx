import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Calendar, Col, Row, Select, Button, Space, Badge } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';

dayjs.extend(dayLocaleData);
dayjs.locale('zh-cn');

const App: React.FC = () => {
  const validRange: [Dayjs, Dayjs] = [
    dayjs('2024-12-01'),
    dayjs('2024-12-31')
  ];

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current);
      return (
        <ul className="m-0 p-0 list-none">
          {listData.map((item) => (
            <li key={item.id} className="mb-1">
              <div
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: item.backgroundColor }}
              >
                {item.content}
                {item.time && <span className="ml-1 text-gray-500">{item.time}</span>}
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const customHeader = ({ value, type, onChange, onTypeChange }) => {
    return (
      <div className="p-4 border-b border-gray-200">
        <Row justify="space-between" align="middle">
          <Col>
            <h4 className="text-xl font-medium m-0">
              {value.format('YYYY年MM月')}
            </h4>
          </Col>
          <Col>
            <Space>
              <Button className="flex items-center justify-center">
                <span className="text-lg">+</span>
              </Button>
              <Select
                size="middle"
                defaultValue="month"
                className="w-20"
              >
                <Select.Option value="month">月</Select.Option>
                <Select.Option value="week">周</Select.Option>
              </Select>
              <Button>今天</Button>
            </Space>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg h-screen overflow-hidden">
      <Calendar
        headerRender={customHeader}
        cellRender={cellRender}
        className="custom-calendar"
        validRange={validRange}
        locale={{
          lang: {
            locale: 'zh-cn',
            monthFormat: 'M月',
            yearFormat: 'YYYY年',
            dayFormat: 'D',
          }
        }}
      />
    </div>
  );
};

// 辅助函数：获取事件数据
function getListData(value: Dayjs) {
  // 示例数据，实际应用中需要替换为真实数据
  const date = value.format('YYYY-MM-DD');
  const events = {
    '2024-12-02': [
      { id: 1, content: '制作PPT', backgroundColor: '#E6F4FF' },
      { id: 2, content: '月度计划', backgroundColor: '#E6F4FF' },
      { id: 3, content: '选题会', backgroundColor: '#E6F4FF' },
    ],
    '2024-12-04': [
      { id: 4, content: '苗加课', time: '18:00', backgroundColor: '#E6FFE6' },
      { id: 5, content: '旅行计划', backgroundColor: '#E6FFE6' },
    ],
    // 添加更多日期的事件...
  };

  return events[date] || [];
}

export default App;