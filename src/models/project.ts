import { Reducer, AnyAction, Effect } from "umi";
import { projectApi } from "@/api/index";
import { db } from "@/lib/db/database";

// 定义 Project 类型（直接复用 IProject）
export interface IProject {
  _id: string;
  name: string;
  isOwner: boolean;
  userId: string;
  color?: string | null;
  sortOrder: number;
  sortType: string;
  userCount: number;
  etag: string;
  modifiedTime: Date;
  inAll: boolean;
  muted: boolean;
  needAudit: boolean;
  openToTeam: boolean;
  source: number;
  createdAt: Date;
  updatedAt: Date;
  visible?: boolean; // 可选添加 visible 属性（原功能需要）
}

// 定义 ListState 类型
export interface ListState {
  projects: IProject[]; // 修改字段名以更语义化
}

export interface ListModelType {
  namespace: "project";
  state: ListState;
  reducers: {
    setProjects: Reducer<ListState, AnyAction>;
    addProject: Reducer<ListState, AnyAction>;
    removeProject: Reducer<ListState, AnyAction>;
    toggleVisible: Reducer<ListState, AnyAction>;
    reorderProjects: Reducer<ListState, AnyAction>;
  };
  // 修正 subscriptions 类型定义
  subscriptions: {
    setup: ({ dispatch, history }: any) => void;
  };
  effects: { getProjectsByUserId: Effect };
}

const ListModel: ListModelType = {
  namespace: "project",

  state: {
    projects: [], // 清空示例数据，从接口获取真实数据
  },
  reducers: {
    // 设置整个项目列表
    setProjects(state: ListState, { payload }: AnyAction) {
      return { ...state, projects: payload };
    },

    // 添加单个项目
    addProject(state: ListState, { payload }: AnyAction) {
      return { ...state, projects: [...state.projects, payload] };
    },

    // 根据 _id 删除项目
    removeProject(state: ListState, { payload }: AnyAction) {
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== payload),
      };
    },

    // 切换可见性（需确保 IProject 有 visible 属性）
    toggleVisible(state: ListState, { payload }: AnyAction) {
      const newProjects = state.projects.map((project) =>
        project._id === payload
          ? { ...project, visible: !project.visible }
          : project
      );
      return { ...state, projects: newProjects };
    },

    // 根据拖拽结果更新排序
    reorderProjects(state: ListState, { payload }: AnyAction) {
      return { ...state, projects: payload };
    },
  },
  effects: {
    *getProjectsByUserId(
      action: AnyAction,
      { call, put, select }: any
    ): Generator<any, void, { data: any[] }> {
      const { payload } = action;
      try {
        // 调用 API 接口
        const response = yield call(projectApi.getProjectsByUserId, localStorage.getItem("user_id"));

        // 处理返回数据（按需转换格式）
        const projects = response.data.map((item: any) => ({
          ...item,
          visible: true, // 添加需要的 visible 属性
          modifiedTime: new Date(item.modifiedTime), // 转换日期格式
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        // 更新 state
        yield put({
          type: "setProjects",
          payload: projects,
        });

        db.projects.bulkPut(projects);
      } catch (error) {
        console.error("获取项目列表失败:", error);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // 或直接初始化加载（根据需求选择）
      dispatch({ type: "getProjectsByUserId" });
    },
  },
};

export default ListModel;
