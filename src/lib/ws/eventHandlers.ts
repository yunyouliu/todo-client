// src/eventHandlers.ts
import EventManager from "./EventManager";
import { db } from "../db/database";
import { SyncStrategies } from "../db/syncStrategies";
import { ITask } from "../db/database";
import { WebSocketManager } from "./WebSocketManager";

const EventHandlers = {
  register(wsManager: WebSocketManager) {
    // 初始化同步
    EventManager.on("INIT_SYNC", async (payload: ITask[], isOwnMessage) => {
      if (isOwnMessage) return;
      console.log("收到 INIT_SYNC 消息:", payload);
      await db.transaction("rw", db.tasks, async () => {
        for (const remoteTask of payload) {
          const localTask = await db.tasks.get(remoteTask._id);
          if (!localTask || SyncStrategies.resolve(localTask, remoteTask)) {
            await db.tasks.put(remoteTask);
          }
        }
      });
    });

    // 任务创建
    EventManager.on("TASK_CREATE", async (payload: ITask, isOwnMessage) => {
      if (isOwnMessage) return;

      console.log("收到 TASK_CREATE 消息:", payload);
      await db.tasks.put({
        ...payload,
        syncStatus: "synced",
      });
    });

    // 任务更新
    EventManager.on("TASK_UPDATE", async (payload: ITask, isOwnMessage) => {
      if (isOwnMessage) return;

      const localTask = await db.tasks.get(payload._id);
      if (localTask && SyncStrategies.resolve(localTask, payload)) {
        await db.tasks.update(payload._id, {
          ...payload,
          syncStatus: "synced",
        });
      }
    });

    // 任务删除
    EventManager.on(
      "TASK_DELETE",
      async (payload: { _id: string }, isOwnMessage) => {
        if (isOwnMessage) return;

        await db.tasks.delete(payload._id);
      }
    );
  },

  unregister() {
    EventManager.off("INIT_SYNC");
    EventManager.off("TASK_CREATE");
    EventManager.off("TASK_UPDATE");
    EventManager.off("TASK_DELETE");
  },
};

export default EventHandlers;
