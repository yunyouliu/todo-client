// src/lib/db/offlineSync.ts
import { db } from "./database";
import { ITask } from "./database";
import { Table } from "dexie";

interface QueuedOperation {
  id: string;
  type: "create" | "update" | "delete";
  task: ITask;
  timestamp: number;
  retries: number;
}

export class OfflineQueue {
  static async enqueue(op: Omit<QueuedOperation, "id">) {
    await db.syncQueue.add(op);
  }

  static async retryFailed() {
    const ops = await db.syncQueue.toArray();

    for (const op of ops) {
      try {
        await this.tryOperation(op);
        await db.syncQueue.delete(op.id!);
      } catch (error) {
        await db.syncQueue.update(op.id!, { retries: op.retries + 1 });
      }
    }
  }

  private static async tryOperation(op: QueuedOperation) {
    const delay = this.calculateBackoff(op.retries);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 实际发送逻辑需要接入TaskOperations
    // await taskOperations.resend(op);
  }

  private static calculateBackoff(retries: number) {
    return Math.min(1000 * Math.pow(2, retries), 30000);
  }
}

// 扩展数据库定义
declare module "./database" {
  interface TodoDB {
    syncQueue: Table<QueuedOperation, number>;
  }
}

// 初始化队列表
db.version(2).stores({
  syncQueue: "++id",
});
