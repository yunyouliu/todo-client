import { Reducer, AnyAction } from 'umi';

// 定义 ListItem 类型
export interface ListItem {
  key: string; // 唯一标识符
  label: string; // 标签文字
  count?: number; // 可选的计数
  visible: boolean; // 控制是否显示该项
}

// 定义 ListState 类型
export interface ListState {
  list: ListItem[]; // 存储任务、清单等项目
}

export interface ListModelType {
  namespace: 'list'; // DVA model 的命名空间
  state: ListState; // model 状态
  reducers: {
    setList: Reducer<ListState, AnyAction>; // 设置 list 数据
    addListItem: Reducer<ListState, AnyAction>; // 向 list 中添加项
    removeListItem: Reducer<ListState, AnyAction>; // 从 list 中移除项
    toggleVisible: Reducer<ListState, AnyAction>; // 切换可见性
    reorderList: Reducer<ListState, AnyAction>; // 根据拖拽结果更新 list 顺序
  };
}

const ListModel: ListModelType = {
  namespace: 'list',

  state: {
    list: [
      { key: '1', label: '👋 欢迎', count: 12, visible: true },
      { key: '2', label: '💼 工作任务', count: 5, visible: true },
      { key: '3', label: '📦 购物清单', count: 8, visible: true },
      { key: '4', label: '📖 学习安排', count: 3, visible: true },
      { key: '5', label: '🎂 生日提醒', count: 2, visible: true },
      { key: '6', label: '🏃 锻炼计划', count: 7, visible: true },
      { key: '7', label: '🦄 心愿清单', count: 1, visible: true },
      { key: '8', label: '🏡 个人备忘', count: 10, visible: true },
    ],
  },

  reducers: {
    // 设置 list 数据
    setList(state: ListState, { payload }: AnyAction) {
      return { ...state, list: payload };
    },

    // 向 list 中添加项
    addListItem(state: ListState, { payload }: AnyAction) {
      return { ...state, list: [...state.list, payload] };
    },

    // 从 list 中移除项
    removeListItem(state: ListState, { payload }: AnyAction) {
      return {
        ...state,
        list: state.list.filter((item) => item.key !== payload),
      };
    },

    // 切换 list 中项的可见性
    toggleVisible(state: ListState, { payload }: AnyAction) {
      const newList = state.list.map((item) =>
        item.key === payload ? { ...item, visible: !item.visible } : item
      );
      return { ...state, list: newList };
    },

    // 更新 list 顺序，基于拖拽操作
    reorderList(state: ListState, { payload }: AnyAction) {
      return { ...state, list: payload }; // 更新排序后的 list
    },
  },
};

export default ListModel;
