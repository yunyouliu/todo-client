interface SidebarItem {
    key: string; // 唯一标识
    icon: React.ReactNode; // 图标，可以是组件或 JSX
    label: string; // 文字标签
    count?: number; // 可选的计数
  }
  
  // 定义组件 Props 类型
  export interface SidebarProps {
    data: SidebarItem[]; // 侧边栏项数组
    activeKey: string; // 当前激活的项
    onItemClick: (key: string) => void; // 点击事件回调函数
  }