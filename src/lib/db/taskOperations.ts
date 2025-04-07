/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-22 14:23:35
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-24 16:49:58
 */
import { db, ITask } from "./database";
import { WebSocketManager } from "@/lib/ws/WebSocketManager";

import { SyncStrategy, SyncStrategies } from "./syncStrategies";

type TaskOperation = "create" | "update" | "delete";

/**
 * 任务操作类，负责处理任务的创建、更新和删除操作，并同步到其他设备
 * 使用本地数据库和WebSocket进行数据管理和实时同步
 */
export class TaskOperations {
  // 同步操作的超时时间
  private static readonly SYNC_TIMEOUT = 3000;

  /**
   * 构造函数
   * @param wsManager WebSocket管理器，用于实时通信
   * @param syncStrategy 同步策略，默认使用时间戳同步
   */
  constructor(
    private wsManager: WebSocketManager,
    private syncStrategy: SyncStrategy = "timestamp"
  ) {
    // 新增构造函数绑定
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  /**
   * 初始化任务操作类，设置数据库钩子和WebSocket监听器
   */
  initialize() {
    this.setupListeners();
  }

  /**
   * 设置数据库钩子，用于在创建、更新和删除任务时执行相应操作
   */
  private setupHooks() {
    // 创建任务钩子
    db.tasks.hook("creating", (primKey: string, task: Omit<ITask, "_id">) => {
      const fullTask: ITask = {
        ...task,
        _id: primKey,
        syncStatus: "pending", // 添加默认同步状态
      };
      this.handleOperation("create", fullTask);
    });

    // 更新任务钩子
    db.tasks.hook(
      "updating",
      (modifications: Partial<ITask>, key: string, origTask: ITask) => {
        const updatedTask: ITask = {
          ...origTask,
          ...modifications,
          updatedAt: new Date(),
        };
        this.handleOperation("update", updatedTask);
        return updatedTask; // 必须返回修改后的对象
      }
    );

    // 删除任务钩子
    db.tasks.hook("deleting", (key: string, task: ITask) => {
      this.handleOperation("delete", task);
    });
  }

  /**
   * 设置WebSocket监听器，处理接收到的更新消息
   */
  private setupListeners() {
    this.wsManager.on("update", (remoteTask: ITask) => {
      this.handleRemoteUpdate(remoteTask);
    });
  }

  /**
   * 处理任务操作，尝试同步操作，失败时将操作加入离线队列
   * @param type 操作类型：创建、更新或删除
   * @param task 任务对象
   */
  private async handleOperation(type: TaskOperation, task: ITask) {
    try {
      await this.trySyncOperation(type, task);
    } catch (error) {
      console.error("同步操作失败，将加入离线队列", error);
    }
  }

  /**
   * 尝试执行同步操作，在指定时间内通过WebSocket发送消息
   * @param type 操作类型：创建、更新或删除
   * @param task 任务对象
   */
  private async trySyncOperation(type: TaskOperation, task: ITask) {
    const message = {
      type: `TASK_${type.toUpperCase()}`,
      payload: task,
      clientId: this.wsManager.clientId,
      timestamp: Date.now(),
    };
    await Promise.race([
      this.wsManager.send(message.type, message.payload),
      new Promise((_, reject) =>
        setTimeout(() => reject("timeout"), TaskOperations.SYNC_TIMEOUT)
      ),
    ]);
  }

  /**
   * 创建任务并同步
   */
  public async createTask(task: Omit<ITask, "_id">): Promise<string> {
    // @ts-ignore
    const fullTask: ITask = {
      ...task,
      syncStatus: "pending",
    };
    await db.tasks.add(fullTask);
    await this.trySyncOperation("create", fullTask);
    return fullTask._id;
  }

  /**
   * 更新任务并同步
   */
  public async updateTask(id: string, changes: Partial<ITask>): Promise<void> {
    const originalTask = await db.tasks.get(id);
    if (!originalTask) throw new Error("任务不存在");
    const updatedTask: ITask = {
      ...originalTask,
      ...changes,
      updatedAt: new Date(),
    };
    await db.tasks.update(id, changes);
    await this.trySyncOperation("update", updatedTask);
  }

  /**
   * 删除任务并同步
   */
  public async deleteTask(id: string): Promise<void> {
    const task = await db.tasks.get(id);
    if (!task) return;
    await db.tasks.delete(id);
    await this.trySyncOperation("delete", task);
  }

  /**
   * 处理远程更新，根据同步策略决定是否更新本地任务
   * @param remoteTask 远程任务对象
   */
  public async handleRemoteUpdate(remoteTask: ITask) {
    const localTask = await db.tasks.get(remoteTask._id);

    if (
      !localTask ||
      SyncStrategies.resolve(localTask, remoteTask, this.syncStrategy)
    ) {
      await db.tasks.put(remoteTask);
    }
  }
}
