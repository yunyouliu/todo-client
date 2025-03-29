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
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private eventHandlers = new Map<string, WSEventHandler>();
  private messageQueue: WSMessage[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  public clientId: string;
  private userId: string;
  private isManuallyClosed = false;
 private lastActivity = new Date();

  private constructor(private url: string) {
    this.userId = this.getUserIdFromStore();
    this.clientId = this.generateClientId(this.userId);
    this.connect();

    // 监听网络状态变化
    window.addEventListener("offline", this.handleOffline);
    window.addEventListener("online", this.handleOnline);
  }

  static getInstance(url: string) {
    if (!this.instance) {
      this.instance = new WebSocketManager(url);
    }
    return this.instance;
  }

  private generateClientId(userId: string): string {
    return `client_${userId}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private getUserIdFromStore() {
    return localStorage.getItem("userId") || "";
  }

  /**
   * 建立WebSocket连接
   */
  private connect() {
    if (this.isManuallyClosed) return;

    const token = encodeURIComponent(localStorage.getItem("t") || "");
    this.socket = new WebSocket(`${this.url}?token=${token}`);

    this.socket.onopen = () => {
      console.log("WebSocket 已连接");
      this.reconnectAttempts = 0;
      if (this.messageQueue.length > 0) {
        this.flushQueue();
      }
      this.startHeartbeat();
    };

    this.socket.onclose = () => {
      console.log("WebSocket 连接关闭");
      this.stopHeartbeat();
      if (
        !this.isManuallyClosed &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        setTimeout(() => this.connect(), this.calculateBackoff());
        this.reconnectAttempts++;
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

      if (this.socket?.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(JSON.stringify(message));
          resolve();
        } catch (error) {
          this.messageQueue.push(message);
          reject(new Error("发送失败"));
        }
      } else {
        this.messageQueue.push(message);
        reject(new Error("连接未就绪"));
      }
    });
  }
  /**
   * 注册消息事件处理器
   */
  on(type: string, handler: WSEventHandler) {
    this.eventHandlers.set(type, handler);
    return this;
  }

  /**
   * 发送队列中的消息
   */
  private flushQueue() {
    console.log(`尝试发送离线队列消息，数量：${this.messageQueue.length}`);
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg)
        this.send(msg.type, msg.payload).catch(() => {
          console.warn("离线队列消息发送失败，重新入队", msg);
          this.messageQueue.unshift(msg);
        });
    }
  }

  /**
   * 计算重连间隔
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
    console.log("网络已恢复，尝试重连 WebSocket");
    this.connect();
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
  }
}
