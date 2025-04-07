import EventManager from "./EventManager";

/**
 * 定义WebSocket事件处理函数类型
 * @param data 事件数据
 * @param isOwnMessage 是否是本机发出的消息
 */
type WSEventHandler = (data: any, isOwnMessage?: boolean) => void;

/**
 * 定义WebSocket消息结构
 */
interface WSMessage<T = any> {
  type: string;
  payload: T;
  clientId: string;
  userId: string;
  timestamp: number;
  version?: number;
}

/**
 * WebSocket管理器类
 */
export class WebSocketManager {
  private static instance: WebSocketManager; // WebSocket管理器单例
  private socket: WebSocket | null = null; // WebSocket实例
  private eventHandlers = new Map<string, WSEventHandler>(); // 事件处理器
  private messageQueue: WSMessage[] = this.loadPersistedQueue(); // 初始化时加载持久化队列
  private reconnectAttempts = 0; // 重连尝试次数
  private maxReconnectAttempts = 5; // 最大重连尝试次数
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null; // 心跳检测间隔
  public clientId: string; // 客户端ID
  private userId: string; // 用户ID
  private isManuallyClosed = false; // 是否手动关闭连接
  private lastActivity = new Date(); // 上次活动时间
  private static readonly QUEUE_KEY = "ws_offline_queue";

  /**
   * 私有构造函数，防止外部实例化
   * @param url WebSocket服务器地址
   */
  private constructor(private url: string) {
    this.userId = this.getUserIdFromStore();
    this.clientId = this.generateClientId(this.userId);
    this.connect();

    // 监听网络状态变化
    window.addEventListener("offline", this.handleOffline);
    window.addEventListener("online", this.handleOnline);
  }

  /**
   * 获取WebSocket管理器的单例
   * @param url WebSocket服务器地址
   * @returns WebSocket管理器实例
   */
  static getInstance(url: string) {
    if (!this.instance) {
      this.instance = new WebSocketManager(url);
    }
    return this.instance;
  }

  private loadPersistedQueue(): WSMessage[] {
    try {
      const queueStr = localStorage.getItem(WebSocketManager.QUEUE_KEY);
      return queueStr ? JSON.parse(queueStr) : [];
    } catch (error) {
      console.error("加载离线队列失败:", error);
      return [];
    }
  }

  private persistQueue() {
    setTimeout(() => {
      // 异步处理避免阻塞主线程
      try {
        localStorage.setItem(
          WebSocketManager.QUEUE_KEY,
          JSON.stringify(this.messageQueue)
        );
      } catch (error) {
        console.error("保存离线队列失败:", error);
        if (
          error instanceof DOMException &&
          error.name === "QuotaExceededError"
        ) {
          console.warn("存储空间不足，清空离线队列");
          this.messageQueue = [];
        }
      }
    }, 0);
  }

  /**
   * 生成客户端ID
   * @param userId 用户ID
   * @returns 客户端ID
   */
  private generateClientId(userId: string): string {
    return `client_${userId}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * 从本地存储获取用户ID
   * @returns 用户ID
   */
  private getUserIdFromStore() {
    return localStorage.getItem("userId") || "";
  }

  /**
   * 建立WebSocket连接
   */
  private connect() {
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    const t = localStorage.getItem("t");
    if (!t) {
      console.error("Token无效，终止连接");
      this.close(); // 主动关闭并清理
      return;
    }
    const token = encodeURIComponent(localStorage.getItem("t") || "");
    this.socket = new WebSocket(`${this.url}?token=${token}`);
    this.socket.onopen = () => {
      console.log("WebSocket 连接成功，准备发送离线队列");
      console.log("当前队列长度:", this.messageQueue.length); // 添加队列状态日志
      this.reconnectAttempts = 0;
      this.flushQueue();
      this.startHeartbeat();
    };

    this.socket.onclose = (event) => {
      console.log(`连接关闭，原因: ${event.code} ${event.reason}`);
      this.stopHeartbeat();
      EventManager.trigger(
        "close",
        { code: event.code, reason: event.reason },
        false
      );
      if (!this.isManuallyClosed) {
        if (event.code === 1000) {
          // 1000为正常关闭
          console.log("服务器主动关闭连接，停止重试");
          return;
        }
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = this.calculateBackoff();
          console.log(
            `将在 ${delay}ms 后尝试第 ${this.reconnectAttempts + 1} 次重连`
          );
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), delay);
        } else {
          console.log("已达最大重连次数，停止重连");
        }
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket 发生错误", error);
      this.socket?.close();
    };

    this.socket.onmessage = (event) => {
      try {
        if (event.data === "pong") {
          console.log("收到 Pong 响应");
          return;
        }
        const message: WSMessage = JSON.parse(event.data);
        console.log("接收到消息:", message);
        const isOwnMessage = message.clientId === this.clientId;
        EventManager.trigger(message.type, message.payload, isOwnMessage);
      } catch (error) {
        console.error("消息解析失败:", error);
      }
    };
  }

  /**
   * 发送消息
   * @param type 消息类型
   * @param payload 消息负载
   * @returns Promise<void>
   */
  send<T>(type: string, payload: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const message: WSMessage<T> = {
        type: type.toUpperCase(), // 统一大写
        payload,
        clientId: this.clientId,
        userId: this.userId,
        timestamp: Date.now(),
        version: 1.2, // 添加版本号
      };
      const handleFailure = () => {
        this.messageQueue.push(message);
        this.persistQueue(); // 持久化存储
        reject(new Error("消息已存入离线队列"));
      };

      if (this.socket?.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(JSON.stringify(message));
          resolve();
        } catch (error) {
          handleFailure();
        }
      } else {
        handleFailure();
      }
    });
  }

  /**
   * 注册消息事件处理器
   * @param type 消息类型
   * @param handler 事件处理器
   * @returns WebSocketManager实例，用于链式调用
   */
  on(type: string, handler: WSEventHandler) {
    this.eventHandlers.set(type, handler);
    return this;
  }

  /**
   * 发送队列中的消息
   */
  private flushQueue() {
    try {
      console.log(`开始发送离线队列，剩余消息数：${this.messageQueue.length}`);
      const MAX_RETRY = 3;
      const sendNext = (retryCount = 0) => {
        if (this.messageQueue.length === 0) {
          console.log("离线队列已清空");
          this.persistQueue();
          return;
        }

        const msg = this.messageQueue.shift();
        if (!msg) return;

        this.send(msg.type, msg.payload)
          .then(() => {
            console.log("成功发送离线消息:", msg.type);
            sendNext();
          })
          .catch((error) => {
            console.warn(
              `发送失败（重试 ${retryCount + 1}/${MAX_RETRY}）:`,
              error
            );
            this.messageQueue.unshift(msg);
            if (retryCount < MAX_RETRY - 1) {
              setTimeout(() => sendNext(retryCount + 1), 1000);
            } else {
              console.error("消息重试次数耗尽，放弃发送:", msg.type);
              this.persistQueue();
            }
          })
          .finally(() => {
            this.persistQueue(); // 确保每次操作后更新存储
          });
      };

      sendNext();
    } catch (error) {
      console.error("处理离线队列时发生致命错误:", error);
    }
  }

  /**
   * 计算重连间隔
   * @returns 重连间隔时间（毫秒）
   */
  private calculateBackoff() {
    return Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
  }

  /**
   * 监听网络断开事件
   */
  private handleOffline = () => {
    console.warn("网络已断开，WebSocket 将自动重连");
    this.socket?.close();
  };

  /**
   * 监听网络恢复事件
   */
  private handleOnline = () => {
    console.log("网络已恢复，1秒后尝试重连 WebSocket");
    setTimeout(() => this.connect(), 1000); // 增加1秒延迟
  };

  /**
   * 发送心跳检测
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const heartbeatMsg = {
        type: "HEARTBEAT",
        payload: { timestamp: Date.now() },
        clientId: this.clientId,
        userId: this.userId,
      };

      this.send("HEARTBEAT", heartbeatMsg.payload).catch(() => {
        console.warn("心跳检测失败，尝试重连 WebSocket");
        this.connect();
      });
    }, 30000); // 每30秒发送心跳
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 关闭 WebSocket 连接
   */
  close() {
    console.log("手动关闭 WebSocket 连接");
    this.isManuallyClosed = true;
    this.socket?.close();
    this.stopHeartbeat();
    // 移除事件监听
    window.removeEventListener("offline", this.handleOffline);
    window.removeEventListener("online", this.handleOnline);
  }
}