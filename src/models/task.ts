// src/models/taskModel.ts
import { Effect, Reducer } from "umi";
import { db, ITask } from "@/lib/db/database";

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
    *addTask({ payload }, { call, put }) {
      try {
        const id: string = yield call(
          () => db.tasks.add(payload) as Promise<string>
        );
        yield put({ type: "loadTasks" }); // 重新加载最新数据
        return id;
      } catch (error) {
        console.error("添加任务失败:", error);
      }
    },
    *updateTask({ payload: { id, changes } }, { call, put }) {
      try {
        yield call(() => db.tasks.update(id, changes));
        yield put({ type: "loadTasks" }); // 重新加载最新数据
      } catch (error) {
        console.error("更新任务失败:", error);
      }
    },
    *deleteTask({ payload: id }, { call, put }) {
      try {
        yield call(() => db.tasks.update(id, { isDeleted: true }));
        yield put({ type: "loadTasks" }); // 重新加载最新数据
      } catch (error) {
        console.error("删除任务失败:", error);
      }
    },
  },
};

export default TaskModel;
