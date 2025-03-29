/**
 * @Descripttion: 定义同步策略类型
 * @version: 1.0.0
 * @Author: yunyouliu
 * @Date: 2025-03-22 16:34:44
 * @LastEditors: yunyouliu
 * @LastEditTime: 2025-03-24 15:24:29
 */
export type SyncStrategy = "timestamp" | "manual" | "server";
import { ITask } from "./database";

export class SyncStrategies {
  /**
   * 解决同步冲突的方法
   * @param local 本地任务
   * @param remote 远程任务
   * @param strategy 同步策略，默认为时间戳同步
   * @returns boolean 表示是否采用远程任务
   */
  static resolve(
    local: ITask,
    remote: ITask,
    strategy: SyncStrategy = "timestamp"
  ): boolean {
    switch (strategy) {
      case "timestamp":
        // 使用最后写入时间获胜的策略
        return this.lastWriteWins(local, remote);
      case "server":
        // 服务器优先策略，始终采用远程任务
        return true;
      default:
        // 默认策略，不采用远程任务
        return false;
    }
  }

  /**
   * 最后写入获胜的同步策略
   * @param local 本地任务
   * @param remote 远程任务
   * @returns boolean 如果远程任务的更新时间晚于本地任务，则返回true，否则返回false
   */
  private static lastWriteWins(local: ITask, remote: ITask) {
    return remote.updatedAt > local.updatedAt;
  }
}