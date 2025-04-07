import { Effect, Reducer } from "umi";
import { WebSocketManager } from "@/lib/ws/WebSocketManager";
import { TaskOperations } from "@/lib/db/taskOperations";
import EventHandlers from "@/lib/ws/eventHandlers";

// WebSocket 状态定义
export interface WebSocketState {
  isConnected: boolean; // WebSocket 连接状态
  retryCount: number; // 重试次数
  lastActivity?: Date; // 上次活动时间
  error?: Error; // 连接错误信息
  queueSize: number; // 离线队列大小
}

// WebSocket 模型类型定义
export interface WebSocketModelType {
  namespace: "websocket"; // 命名空间
  state: WebSocketState; // 状态定义
  reducers: {
    updateStatus: Reducer<WebSocketState>; // 更新 WebSocket 连接状态
    recordError: Reducer<WebSocketState>; // 记录 WebSocket 错误信息
    updateQueueSize: Reducer<WebSocketState>; // 更新离线队列大小
  };
  effects: {
    initialize: Effect; // 初始化 WebSocket 连接
    checkConnection: Effect; // 检查 WebSocket 连接状态
  };
  subscriptions: {
    setup: any; // 订阅器，监听网络变化
  };
}

const WebSocketModel: WebSocketModelType = {
  namespace: "websocket",

  state: {
    isConnected: false, // 初始状态：未连接
    retryCount: 0, // 初始重试次数
    queueSize: 0, // 初始离线队列大小
  },

  reducers: {
    // 更新 WebSocket 连接状态
    updateStatus(state, { payload }) {
      return { ...state, ...payload };
    },
    // 记录 WebSocket 连接错误
    recordError(state, { payload }) {
      return { ...state, error: payload, isConnected: false };
    },
    // 更新离线队列大小
    updateQueueSize(state, { payload }) {
      return { ...state, queueSize: payload };
    },
  },

  effects: {
    // 初始化 WebSocket 连接
    *initialize(_, { call, put, select }) {
      try {
        const { isConnected }: { isConnected: boolean } = yield select(
          (state: { websocket: WebSocketState }) => state.websocket
        );
        if (isConnected) return;

        const wsManager = WebSocketManager.getInstance("/ws");
        const taskOps = new TaskOperations(wsManager, "timestamp");
        yield call([taskOps, taskOps.initialize]);
        //  注册事件处理器
        EventHandlers.register(wsManager);
        const closeHandler = (event: { code: number }) => {
          // 如果是正常关闭（code 1000），不触发重连
          if (event.code === 1000) {
            put({ type: "updateStatus", payload: { isConnected: false } });
          } else {
            put({ type: "checkConnection" }); // 触发重连检查
          }
        };
        wsManager
          .on("open", () =>
            put({ type: "updateStatus", payload: { isConnected: true } })
          )
          .on("close", closeHandler) // 正确触发 onClose
          .on("error", (err) => put({ type: "recordError", payload: err }));

        // 初始化离线队列监控
        yield put({ type: "monitorQueue" });
      } catch (error) {
        yield put({ type: "recordError", payload: error });
        yield put({ type: "handleReconnect" });
      }
    },
    // 检查 WebSocket 连接状态，如果断开则重连
    *checkConnection(_, { put, select, delay }) {
      const { isConnected, retryCount }: WebSocketState = yield select(
        (state: { websocket: WebSocketState }) => state.websocket
      );

      if (isConnected) return;

      // 限制最大重试次数（例如5次）
      if (retryCount >= 5) {
        console.error("已达最大重试次数，停止重连");
        return;
      }

      // 指数退避延迟
      const backoffDelay = Math.min(1000 * 2 ** retryCount, 30000);
      yield delay(backoffDelay);

      // 触发重新初始化
      yield put({ type: "initialize" });
      yield put({
        type: "updateStatus",
        payload: { retryCount: retryCount + 1 },
      });
    },
  },

  subscriptions: {
    setup({ dispatch }: { dispatch: (arg: any) => void }) {
      // 初始化 WebSocket 连接
      dispatch({ type: "initialize" });

      // 监听网络恢复，重新检查 WebSocket 连接
      const handleOnline = () => {
        dispatch({ type: "checkConnection" });
      };

      window.addEventListener("online", handleOnline);

      // 每 5 分钟检查一次 WebSocket 连接状态
      const timer = setInterval(() => {
        dispatch({ type: "checkConnection" });
      }, 300_000);

      return () => {
        window.removeEventListener("online", handleOnline);
        clearInterval(timer);
        EventHandlers.unregister();
        WebSocketManager.getInstance("/ws").close(); // 关闭连接
      };
    },
  },
};

export default WebSocketModel;
