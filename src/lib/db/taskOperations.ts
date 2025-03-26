/*
 * @Descripttion: 任务操作类，负责任务的创建、更新和删除，并同步数据
 * @version: 1.1.0
 * @Author: yunyouliu
 * @Date: 2025-03-22 14:23:35
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-24 16:49:58
 */
import { db, ITask } from "./database";
import { WebSocketManager } from "@/lib/ws/WebSocketManager";
import { OfflineQueue } from "./offlineSync";
import { SyncStrategy, SyncStrategies } from "./syncStrategies";

type TaskOperation = "create" | "update" | "delete";

export class TaskOperations {
  private static readonly SYNC_TIMEOUT = 3000;

  constructor(
    private wsManager: WebSocketManager,
    private syncStrategy: SyncStrategy = "timestamp"
  ) {}

  initialize() {
    this.setupHooks();
    this.setupListeners();
  }

  private setupHooks() {
    db.tasks.hook("creating", (primKey: string, task: Omit<ITask, "_id">) => {
      const fullTask: ITask = { ...task, _id: primKey, syncStatus: "pending" };
      this.handleOperation("create", fullTask);
    });

    db.tasks.hook(
      "updating",
      (modifications: Partial<ITask>, key: string, origTask: ITask) => {
        const updatedTask: ITask = {
          ...origTask,
          ...modifications,
          updatedAt: new Date(),
        };
        this.handleOperation("update", updatedTask);
        return updatedTask;
      }
    );

    db.tasks.hook("deleting", (key: string, task: ITask) => {
      this.handleOperation("delete", task);
    });
  }

  private setupListeners() {
    this.wsManager.on("update", (remoteTask: ITask) => {
      this.handleRemoteUpdate(remoteTask);
    });
  }

  private async handleOperation(type: TaskOperation, task: ITask) {
    try {
      await this.trySyncOperation(type, task);
    } catch (error) {
      await OfflineQueue.enqueue({
        type,
        task,
        timestamp: Date.now(),
        retries: 0,
      });
    }
  }

  private async trySyncOperation(type: TaskOperation, task: ITask) {
    const message = {
      type: `TASK_${type.toUpperCase()}`,
      payload: task,
      clientId: localStorage.clientId,
      timestamp: Date.now(),
    };

    await Promise.race([
      this.wsManager.send(message.type, message.payload),
      new Promise((_, reject) =>
        setTimeout(() => reject("timeout"), TaskOperations.SYNC_TIMEOUT)
      ),
    ]);
  }

  private async handleRemoteUpdate(remoteTask: ITask) {
    const localTask = await db.tasks.get(remoteTask._id);

    if (!localTask || SyncStrategies.resolve(localTask, remoteTask, this.syncStrategy)) {
      await db.tasks.put(remoteTask);
    }
  }

  /**
   * 登录后同步远程任务数据，仅更新有变化的任务，避免数据覆盖
   * @param remoteTasks 服务器返回的任务列表
   */
  public async syncTasksAfterLogin(remoteTasks: ITask[]) {
    for (const remoteTask of remoteTasks) {
      const localTask = await db.tasks.get(remoteTask._id);

      // 如果本地不存在，或者远程数据更新过，才进行存储
      if (!localTask || SyncStrategies.resolve(localTask, remoteTask, this.syncStrategy)) {
        await db.tasks.put(remoteTask);
      }
    }
  }
}
