import EventManager from "./EventManager";
/**
 * 定义WebSocket事件处理函数类型
 * @param data 事件数据
 * @param isOwnMessage 是否是本机发出的消息
 */
type WSEventHandler = (data: any, isOwnMessage?: boolean) => void;

/**
 * 定义WebSocket消息结构
 * @template T 消息载荷类型
 * @property type 消息类型
 * @property payload 消息载荷
 * @property clientId 当前客户端ID
 * @property userId 当前用户ID
 * @property timestamp 时间戳
 * @property version 版本号（可选）
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
 * WebSocket管理器类，用于管理WebSocket连接和消息
 */
export class WebSocketManager {
  // 单例模式，存储唯一的实例
  private static instance: WebSocketManager;
  // WebSocket连接实例
  private socket: WebSocket | null = null;
  // 事件处理器映射，用于存储不同消息类型的处理函数
  private eventHandlers = new Map<string, WSEventHandler>();
  // 消息队列，用于暂存连接未建立时的消息
  private messageQueue: WSMessage[] = [];
  // 重连尝试次数
  private reconnectAttempts = 0;
  // 最大重连尝试次数
  private maxReconnectAttempts = 5;
  // 客户端ID
  private clientId: string;
  // 用户ID
  private userId: string;

  /**
   * 私有构造函数，防止外部直接实例化
   * @param url WebSocket服务器URL
   */
  private constructor(private url: string) {
    this.userId = this.getUserIdFromStore();
    this.clientId = this.generateClientId(this.userId);
    this.connect();
  }

  /**
   * 单例模式获取实例的方法
   * @param url WebSocket服务器URL
   * @returns WebSocketManager实例
   */
  static getInstance(url: string) {
    if (!this.instance) {
      this.instance = new WebSocketManager(url);
    }
    return this.instance;
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
   * 建立WebSocket连接的方法
   */
  private connect() {
    const token = encodeURIComponent(localStorage.getItem("t") || "");
    // 将Token放在URL参数中
    this.socket = new WebSocket(`${this.url}?token=${token}`);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.flushQueue();
    };

    this.socket.addEventListener("message", (event) => {
      try {
        if (event.data instanceof ArrayBuffer && event.data.byteLength === 0) {
          return; // 忽略心跳帧
        }

        const message: WSMessage = JSON.parse(event.data);
        console.log("接收到消息:", message);
        const isOwnMessage = message.clientId === this.clientId;
        this.eventHandlers.get(message.type)?.(message.payload, isOwnMessage);
      } catch (error) {
        console.error("消息解析失败:", error);
      }
    });

    this.socket.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.connect(), this.calculateBackoff());
        this.reconnectAttempts++;
      }
    };

    this.socket.onmessage = (event) => {
      try {
        // 处理心跳Ping（后端发送的ping是opcode 0x9，浏览器会自动回复pong）
        if (event.data instanceof ArrayBuffer && event.data.byteLength === 0) {
          return; // 忽略心跳帧
        }

        // 正常消息处理
        const message: WSMessage = JSON.parse(event.data);
        console.log("接收到消息:", message);
        const isOwnMessage = message.clientId === this.clientId;
        this.eventHandlers.get(message.type)?.(message.payload, isOwnMessage);
      } catch (error) {
        console.error("消息解析失败:", error);
      }
    };
  }

  /**
   * 发送消息的方法
   * @template T 消息载荷类型
   * @param type 消息类型
   * @param payload 消息载荷
   */
  send<T>(type: string, payload: T) {
    const message: WSMessage<T> = {
      type,
      payload,
      clientId: this.clientId,
      userId: this.userId,
      timestamp: Date.now(),
    };

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  /**
   * 注册消息事件处理器的方法
   * @param type 消息类型
   * @param handler 消息事件处理器
   */
  on(type: string, handler: WSEventHandler) {
    this.eventHandlers.set(type, handler);
    return this;
  }

  /**
   * 发送队列中的消息
   */
  private flushQueue() {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg) this.send(msg.type, msg.payload);
    }
  }

  /**
   * 计算重连间隔的方法
   * @returns 重连间隔时间（毫秒）
   */
  private calculateBackoff() {
    return Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
  }
}
