type WSEventHandler = (data: any, isOwnMessage?: boolean) => void;

class EventManager {
  private static instance: EventManager;
  private eventHandlers = new Map<string, WSEventHandler>();

  private constructor() {}

  static getInstance(): EventManager {
    if (!this.instance) {
      this.instance = new EventManager();
    }
    return this.instance;
  }

  /**
   * 注册 WebSocket 事件
   * @param type 消息类型
   * @param handler 处理函数
   */
  on(type: string, handler: WSEventHandler) {
    this.eventHandlers.set(type, handler);
  }

  /**
   * 取消订阅指定事件
   *移除已订阅的事件及其对应的处理函数
   * @param event 要取消订阅的事件名称
   */
  off(event: string) {
    this.eventHandlers.delete(event);
  }

  /**
   * 触发 WebSocket 事件
   * @param type 消息类型
   * @param payload 消息数据
   * @param isOwnMessage 是否是自己发的消息
   */
  trigger(type: string, payload: any, isOwnMessage: boolean) {
    const handler = this.eventHandlers.get(type);
    if (handler) {
      handler(payload, isOwnMessage);
    } else {
      console.warn(`未找到 WebSocket 事件: ${type}`);
    }
  }
}

export default EventManager.getInstance();
