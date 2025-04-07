// src/models/taskModel.ts
import { Effect, Reducer } from "umi";
import { db, ITask } from "@/lib/db/database";
import { TaskOperations } from "@/lib/db/taskOperations";
import { WebSocketManager } from "@/lib/ws/WebSocketManager";
import { taskApi } from "@/api";

// 初始化依赖
const wsManager = WebSocketManager.getInstance("/ws");
const taskOperations = new TaskOperations(wsManager, "timestamp");

export interface TaskModelState {
  tasks: ITask[];
}

export interface TaskModelType {
  namespace: "task";
  state: TaskModelState;
  reducers: {
    updateTasks: Reducer<TaskModelState>;
  };
  effects: {
    loadTasks: Effect;
    addTask: Effect;
    updateTask: Effect;
    deleteTask: Effect;
    setupHooks: Effect;
    clearDatabase: Effect;
    syncTasksAfterLogin: Effect;
  };
  subscriptions: {
    setup: any;
  };
}

const TaskModel: TaskModelType = {
  namespace: "task",
  state: {
    tasks: [],
  },
  reducers: {
    updateTasks(state, { payload }) {
      return { ...state, tasks: payload };
    },
  },
  effects: {
    *loadTasks(_, { call, put }) {
      try {
        const tasks: ITask[] = yield call(() => db.tasks.toArray());
        yield put({
          type: "updateTasks",
          payload: tasks.filter((t) => !t.isDeleted),
        });
      } catch (error) {
        console.error("加载任务失败:", error);
      }
    },

    *syncTasksAfterLogin(_, { call, put }) {
      try {
        // 清空数据库
        yield call(() => db.tasks.clear());

        // 获取用户任务
        const tasks: ITask[] = yield call(async () => {
          const response = await taskApi.fetchTasks({});
          return response.data;
        });

        // 覆盖本地数据库
        yield call(async () => {
          await db.tasks.bulkAdd(tasks);
        });

        // 重新加载任务
        yield put({ type: "loadTasks" });
        console.log("用户登录后任务同步完成");
      } catch (error) {
        console.error("同步任务失败:", error);
      }
    },
    *addTask({ payload }, { call, put }) {
      try {
        const id: string = yield call(taskOperations.createTask, payload);
        yield put({ type: "loadTasks" });
        return id;
      } catch (error) {
        console.error("添加任务失败:", error);
      }
    },
    *updateTask({ payload: { id, changes } }, { call, put }) {
      try {
        // 使用箭头函数保持 this 指向
        yield call(
          (taskId: string, taskChanges: Partial<ITask>) =>
            taskOperations.updateTask(taskId, taskChanges),
          id,
          changes
        );
        yield put({ type: "loadTasks" });
      } catch (error) {
        console.error("更新任务失败:", error);
      }
    },
    *deleteTask({ payload: id }, { call, put }) {
      try {
        yield call(taskOperations.deleteTask, id);
        yield put({ type: "loadTasks" });
      } catch (error) {
        console.error("删除任务失败:", error);
      }
    },

    *clearDatabase(_, { call }) {
      try {
        yield call(() => db.tasks.clear());
        console.log("数据库已清空");
      } catch (error) {
        console.error("清空数据库失败:", error);
      }
    },
    // 监听数据库变化自动更新
    *setupHooks(_, { put }) {
      // 确保只注册一次监听
      if (!db.tasks.hook["updating"]) {
        db.tasks.hook("updating", () => {
          put({ type: "loadTasks" });
        });
        console.log("数据库变更监听已启动");
      }
    },
  },
  subscriptions: {
    setup({ dispatch }: { dispatch: (action: any) => void }) {
      dispatch({ type: "loadTasks" });
      dispatch({ type: "setupHooks" });
    },
  },
};

export default TaskModel;
