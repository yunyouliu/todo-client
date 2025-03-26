/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-22 16:34:44
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-24 15:24:29
 */
// src/lib/db/syncStrategies.ts
export type SyncStrategy = "timestamp" | "manual" | "server";
import { ITask } from "./database";

export class SyncStrategies {
  static resolve(
    local: ITask,
    remote: ITask,
    strategy: SyncStrategy = "timestamp"
  ): boolean {
    switch (strategy) {
      case "timestamp":
        return this.lastWriteWins(local, remote);
      case "server":
        return true;
      default:
        return false;
    }
  }

  private static lastWriteWins(local: ITask, remote: ITask) {
    return remote.updatedAt > local.updatedAt;
  }
}
